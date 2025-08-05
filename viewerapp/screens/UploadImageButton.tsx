import React from 'react';
import { Button, View, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

type Props = {
  onUploadSuccess?: () => void;
};

const SERVER_URL = 'http://192.168.0.103:3000/upload'; // 실제 IP와 포트로 교체

const UploadImageButton = ({ onUploadSuccess }: Props) => {
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
      if (onUploadSuccess) {
        onUploadSuccess(); // 업로드 성공 후 부모에게 알림
      }
    } catch (error) {
      console.error('업로드 실패:', error);
      Alert.alert('업로드 실패', '서버로 전송하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={{ margin: 10 }}>
      <Button title="이미지 업로드" onPress={pickImageAndUpload} />
    </View>
  );
};

export default UploadImageButton;
