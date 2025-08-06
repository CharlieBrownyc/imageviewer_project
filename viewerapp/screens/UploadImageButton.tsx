import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

type Props = {
  onUploadSuccess?: () => void;
  serverUrl: string; // 추가
};

// const SERVER_URL = 'http://192.168.0.103:3000/upload'; // 실제 IP와 포트로 교체

const UploadImageButton = ({ onUploadSuccess, serverUrl }: Props) => {
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
      const res = await axios.post(`${serverUrl}/upload`, formData, {
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
      <TouchableOpacity style={styles.button} onPress={handleImagePick}>
        <Text style={styles.text}>이미지 업로드</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
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
});

export default UploadImageButton;
