import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import log from '../utils/logger';
import * as Progress from 'react-native-progress';

type Props = {
  onUploadSuccess?: () => void;
  serverUrl: string; // 추가
};

// const SERVER_URL = 'http://192.168.0.103:3000/upload'; // 실제 IP와 포트로 교체

const UploadImageButton = ({ onUploadSuccess, serverUrl }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // 0 ~ 1

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });

    if (result.didCancel || !result.assets || result.assets.length === 0) {
      return;
    }

    const image = result.assets[0];
    if (!image.uri || !image.type || !image.fileName) {
      console.warn('이미지 정보가 불완전합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      type: image.type,
      name: image.fileName || 'photo.jpg',
    } as any);

    try {
      setUploading(true);
      setProgress(0);

      const res = await axios.post(`${serverUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          if (progressEvent.total) {
            const percent = progressEvent.loaded / progressEvent.total;
            setProgress(percent);
            log.debug(`📤 업로드 진행률: ${(percent * 100).toFixed(2)}%`);
          }
        },
      });

      Alert.alert('업로드 성공', `ID: ${res.data.id}`);
      if (onUploadSuccess) {
        onUploadSuccess(); // 업로드 성공 후 부모에게 알림
      }
    } catch (error) {
      console.error('업로드 실패:', error);
      Alert.alert('업로드 실패', '서버로 전송하는 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  useEffect(() => {
    log.info(`🔄 UploadImageButton mounted with serverUrl: ${serverUrl}`);
    return () => {
      log.info('🔄 UploadImageButton unmounted');
    };
  }, [serverUrl]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, uploading && { backgroundColor: '#ccc' }]}
        onPress={handleImagePick}
        disabled={uploading}
      >
        <Text style={styles.text}>
          {uploading ? '업로드 중...' : '이미지 업로드'}
        </Text>
      </TouchableOpacity>
      {uploading && (
        <View style={styles.progressWrapper}>
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
          <Progress.Bar
            progress={progress}
            width={200}
            color="#007aff"
            animated
            useNativeDriver={true}
          />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007aff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressWrapper: {
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  progressText: {
    marginBottom: 4,
  },
});

export default UploadImageButton;
