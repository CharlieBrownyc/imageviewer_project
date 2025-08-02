import React from 'react';
import { Button, View, Alert, Platform } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import CameraRoll from '@react-native-camera-roll/camera-roll';


const ImageEditorButton = () => {
    
    const pickAndEdit = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true, // 자르기 가능
                cropperCircleOverlay: false, // true: 원형 자르기
                compressImageQuality: 0.8,
            });
            
            console.log('편집 완료', `경로: ${image.path}`);

            if(Platform.OS === 'android') {
                return;
            }

            // @ts-ignore
            const savedUri = await CameraRoll.saveToCameraRoll(image.path, { type: 'photo' });
            
            // const savedUri = await CameraRoll.save(image.path, { 
            //     type: 'photo'
            // });

            Alert.alert('✔️ 저장 완료', `갤러리에 저장됨:\n${savedUri}`);
            console.log('✅ 저장된 경로:', savedUri);

        } catch (e) {
            console.warn('이미지 편집 취소 또는 오류', e);
        }
    };

    return (
        <View style={{ margin: 10 }}>
        <Button title="이미지 편집" onPress={pickAndEdit} />
        </View>
    );
};

export default ImageEditorButton;
