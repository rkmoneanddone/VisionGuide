package com.visionguide.app

import android.speech.tts.TextToSpeech
import android.speech.tts.Voice
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.Locale

class VisionGuideTtsModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context), TextToSpeech.OnInitListener {
    private var tts: TextToSpeech? = null
    private var ready = false
    private val pending = mutableListOf<() -> Unit>()

    override fun getName() = "VisionGuideTts"

    init { tts = TextToSpeech(context, this) }

    override fun onInit(status: Int) {
        ready = status == TextToSpeech.SUCCESS
        if (ready) {
            tts?.setSpeechRate(1.08f)
            tts?.setPitch(1.08f)
            val actions = pending.toList()
            pending.clear()
            actions.forEach { it() }
        } else pending.clear()
    }

    private fun localeFor(tag: String): Locale = Locale.forLanguageTag(tag.ifBlank { "en-IN" })

    private fun bestVoice(engine: TextToSpeech, locale: Locale): Voice? {
        val language = locale.language
        val country = locale.country
        return engine.voices
            ?.filter { it.locale.language == language && !it.isNetworkConnectionRequired }
            ?.sortedWith(compareByDescending<Voice> { it.locale.country == country }
                .thenByDescending { it.quality }
                .thenBy { it.latency })
            ?.firstOrNull()
    }

    @ReactMethod
    fun speak(text: String, languageTag: String, promise: Promise) {
        if (text.isBlank()) { promise.reject("EMPTY_TEXT", "There is no recognized text to read."); return }
        val action = {
            val engine = tts
            if (engine == null) promise.reject("TTS_UNAVAILABLE", "Text to speech is unavailable on this device.")
            else {
                val locale = localeFor(languageTag)
                if (engine.isLanguageAvailable(locale) >= TextToSpeech.LANG_AVAILABLE) engine.language = locale
                bestVoice(engine, locale)?.let { engine.voice = it }
                engine.setSpeechRate(1.08f)
                engine.setPitch(1.08f)
                engine.stop()
                val result = engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, "visionguide-reading")
                if (result == TextToSpeech.SUCCESS) promise.resolve(true)
                else promise.reject("TTS_FAILED", "Unable to start text to speech.")
            }
        }
        if (ready) action() else pending.add(action)
    }

    @ReactMethod
    fun stop(promise: Promise) { tts?.stop(); promise.resolve(true) }

    override fun invalidate() {
        tts?.stop(); tts?.shutdown(); tts = null
        super.invalidate()
    }
}
