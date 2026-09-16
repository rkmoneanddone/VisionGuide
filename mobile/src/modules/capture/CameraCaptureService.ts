import {PermissionsAndroid, Platform} from 'react-native';
import {launchCamera} from 'react-native-image-picker';

export interface CapturedPhoto {
  uri: string;
  fileName?: string;
  type?: string;
  width?: number;
  height?: number;
}

async function ensureCameraPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
    title: 'Camera permission',
    message: 'VisionGuide uses your camera to scan documents and printed text.',
    buttonPositive: 'Allow',
    buttonNegative: 'Not now',
  });
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function capturePhoto(): Promise<CapturedPhoto | null> {
  const allowed = await ensureCameraPermission();
  if (!allowed) throw new Error('Camera permission is required to scan.');

  const response = await launchCamera({
    mediaType: 'photo',
    cameraType: 'back',
    quality: 0.9,
    saveToPhotos: false,
  });

  if (response.didCancel) return null;
  if (response.errorCode) throw new Error(response.errorMessage ?? 'Unable to open the camera.');

  const asset = response.assets?.[0];
  if (!asset?.uri) throw new Error('The camera did not return a photo.');

  return {
    uri: asset.uri,
    fileName: asset.fileName,
    type: asset.type,
    width: asset.width,
    height: asset.height,
  };
}
