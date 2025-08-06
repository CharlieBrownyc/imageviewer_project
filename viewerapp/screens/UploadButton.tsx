// 예: LocalImagesScreen.tsx 또는 UploadButton.tsx 등
import React from 'react';
import { Button, View, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const SERVER_URL = 'http://192.168.0.103:3000/upload'; // 예: http://192.168.0.5:3000/upload

const UploadButton = () => {
  const pickImageAndUpload = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });

    if (result.didCancel || !result.assets || result.assets.length === 0) {
      return;
    }

    const photo = result.assets[0];
    const formData = new FormData();

    formData.append('file', {
      uri: photo.uri,
      type: photo.type,
      name: photo.fileName || 'photo.jpg',
    } as any);

    try {
      const res = await axios.post(SERVER_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('업로드 성공', `ID: ${res.data.id}`);
    } catch (error) {
      console.error('업로드 실패:', error);
      Alert.alert('업로드 실패');
    }
  };

  return (
    <View style={{ margin: 10 }}>
      <Button title="이미지 업로드" onPress={pickImageAndUpload} />
    </View>
  );
};

export default UploadButton;
