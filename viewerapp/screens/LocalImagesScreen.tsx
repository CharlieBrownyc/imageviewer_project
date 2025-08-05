import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  PermissionsAndroid,
  Platform,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import ImageViewing from 'react-native-image-viewing';
import UploadImageButton from './UploadButton';
import ImageEditorButton from './ImageEditorButton';

const screenWidth = Dimensions.get('window').width;
const imageMargin = 4;
const numColumns = 3;
const imageSize = (screenWidth - imageMargin * (numColumns + 1)) / numColumns;

const LocalImagesScreen = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  console.log('LocalImagesScreen rendered: Platform.OS:', Platform.OS);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      console.log('🔐 권한 요청 시도 중...');
      const sdkVersion = Platform.constants?.Release; // 예: "9" or "13"
      const apiLevel = Platform.Version as number; // 예: 28
      console.log(`📱 Android SDK: ${sdkVersion}, API: ${apiLevel}`);

      if (apiLevel >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );
        console.log('권한 응답 (READ_MEDIA_IMAGES):', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        console.log('권한 응답 (READ_EXTERNAL_STORAGE):', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  };

  useEffect(() => {
    const loadImages = async () => {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        console.log('🚫 권한 거부됨');
        return;
      }
      console.log('✅ 권한 허용됨, 사진 불러오는 중...');

      try {
        const result = await CameraRoll.getPhotos({
          first: 100,
          assetType: 'Photos',
          groupName: 'Download',
        });

        console.log('🖼️ 불러온 사진 개수:', result.edges.length);

        // 모든 이미지 URI와 파일명 로그 출력
        result.edges.forEach((edge: any, index: number) => {
          const uri = edge.node.image.uri;
          const filename = edge.node.image.filename || '(파일명 없음)';
          console.log(`📷 [${index}] URI: ${uri}`);
          console.log(`📄 파일명: ${filename}`);
        });
        const uris = result.edges.map((edge: any) => edge.node.image.uri);
        setPhotos(uris);
      } catch (error) {
        console.error('사진 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [refreshTrigger]);

  const imagesForViewer = photos.map(uri => ({ uri }));

  return (
    <View style={{ flex: 1, padding: imageMargin }}>
      <View style={styles.container}>
        <View style={styles.buttonWrapper}>
          <ImageEditorButton
            onSaveSuccess={() => {
              setLoading(true); // 로딩 인디케이터 표시
              setRefreshTrigger(prev => prev + 1); // 트리거 변경 → useEffect 재실행
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <UploadImageButton />
        </View>
      </View>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#007aff" />
          <Text style={{ marginTop: 12 }}>이미지를 불러오는 중입니다...</Text>
        </View>
      ) : photos.length === 0 ? (
        <Text style={{ textAlign: 'center' }}>이미지가 없습니다.</Text>
      ) : (
        <>
          <FlatList
            data={photos}
            numColumns={numColumns}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setCurrentIndex(index);
                  setVisible(true);
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{
                    width: imageSize,
                    height: imageSize,
                    margin: imageMargin,
                    borderRadius: 12,
                    backgroundColor: '#eee',
                  }}
                />
              </TouchableOpacity>
            )}
          />
          <ImageViewing
            images={imagesForViewer}
            imageIndex={currentIndex}
            visible={visible}
            onRequestClose={() => setVisible(false)}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    flex: 1,
  },
});

export default LocalImagesScreen;
