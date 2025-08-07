import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import UploadImageButton from './UploadImageButton';
import ImageViewing from 'react-native-image-viewing';
import log from '../utils/logger';
import { useFocusEffect } from '@react-navigation/native';

// const BASE_URL = 'http://192.168.0.103:3000'; // 서버 주소
// const LIST_URL = `${BASE_URL}/images`;

type ServerImage = {
  id: string;
  name: string;
  url: string; // ex: "/uploads/xxx.jpg"
  uploadedAt: string;
};
type Props = {
  serverUrl: string;
};
const ServerImagesScreen = ({ serverUrl }: Props) => {
  const [images, setImages] = useState<ServerImage[]>([]);
  const [isViewerVisible, setViewerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fetchImages = useCallback(async () => {
    try {
      const res = await axios.get<ServerImage[]>(`${serverUrl}/images`);
      setImages(
        res.data.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)),
      ); // 최신순 정렬
    } catch (error) {
      console.error('서버 이미지 불러오기 실패:', error);
    }
  }, [serverUrl]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useFocusEffect(
    useCallback(() => {
      log.info(`🌀 탭 진입 - serverUrl: ${serverUrl}`);
    }, [serverUrl]),
  );

  const openViewer = (index: number) => {
    setSelectedIndex(index);
    setViewerVisible(true);
  };

  const imagesForViewer = images.map(img => ({
    uri: `${serverUrl}${img.url}`,
  }));

  return (
    <View style={styles.container}>
      <UploadImageButton onUploadSuccess={fetchImages} serverUrl={serverUrl} />

      {images.length === 0 ? (
        <Text>서버에 이미지가 없습니다.</Text>
      ) : (
        <FlatList
          data={images}
          numColumns={3}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => openViewer(index)}>
              <Image
                source={{ uri: `${serverUrl}${item.url}` }}
                style={styles.image}
              />
            </TouchableOpacity>
          )}
        />
      )}

      <ImageViewing
        images={imagesForViewer}
        imageIndex={selectedIndex}
        visible={isViewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  image: {
    width: 110,
    height: 110,
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
});

export default ServerImagesScreen;
