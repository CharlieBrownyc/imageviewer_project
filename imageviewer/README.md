# Image Viewer - React Native

### Warning (미결-새프로젝트로 마이그레이션)
> ❗ 참고: New Architecture 사용 중인 경우
위 오류 메시지에  
CMakeLists.txt, codegen, ReactAndroid가 등장하는 것으로 보아  
New Architecture (TurboModules + Fabric) 가 활성화되어 있을 수 있습니다.  
만약 이를 아직 사용하지 않을 계획이라면 기본 아키텍처로 되돌리는 것도 해결 방법입니다.

> 방법:
android/gradle.properties에서 다음 라인을 확인하고, 주석 처리 또는 false로 설정하세요:

> > 기존 값이 true인 경우:  
	`~~newArchEnabled=false~~  `  
> > 아니면 다운그레이드  
	```sh
		# 모든 버전
		npm view react-native-reanimated versions
		# 버전 필터링
		npm view react-native-reanimated@2 versions
		# https://www.npmjs.com/package/react-native-reanimated?activeTab=versions
		# 최신 안정 버전만
		npm show react-native-reanimated version
		# 설치삭제
		npm uninstall react-native-reanimated
		# 설치
		npm install react-native-reanimated@2.17.0
	```


## Getting Started
> **Note**:  
> node v22.17.1 , npm 10.9.2, yarn 1.22.22  
> react-native 0.80.2, Metro 0.82.5

#### RN command [More...](./ReactNative.md)
build & run
* Create New Project
	x. ~~`npx @react-native-community/cli init`~~
	1. `npx @react-native-community/cli init imageviewer`
	2. `npx react-native run-anroid`
* start the Metro dev server Using npm OR using Yarn  
	`npm start`or`yarn start`
* Run Using npm OR using Yarn
    `npm run android`or`yarn android`

gradle clean & build
```sh
# gradle
# cd android
# ./gradlew clean

# Metro cache clear
cd [react root]
#npx react-native start --reset-cache
npx react-native clean # all clean : android, metro, react-native, node_module, yarn ...
npm install
# build & run
npx react-native run-android
```

install dependency package
```bash
npm install --save-dev @types/react
npm install --save-dev @types/react-native
npm install \
  @react-native-camera-roll/camera-roll \
  react-native-image-viewing \
  react-native-image-picker \
  react-native-image-crop-picker \
  react-native-reanimated \
  @react-navigation/native \
  @react-navigation/bottom-tabs \
  react-native-permissions \
  react-native-worklets \  
  axios
npm install \
  react-native-screens \
  react-native-safe-area-context \
  react-native-gesture-handler
```

babel.config.js에 react-native-reanimated/plugin이 포함되어 있어야 합니다:
```groovy
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
  ],
};
```

~~install package~~
```sh
npm install react-native-worklets  
npm install @react-navigation/native @react-navigation/bottom-tabs  
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
# ionicons 
# 아이콘 깨짐 -> add ./android/app/build.gradle below
# apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
npm install react-native-vector-icons
npm install -D @types/react-native-vector-icons
# camera-roll
npm install @react-native-camera-roll/camera-roll
npm install --save-dev @types/react-native
# image-viewing
npm install react-native-image-viewing
# upload
npm install axios react-native-image-picker
# image editor ts 포함
npm install react-native-image-crop-picker
```


### 🧭 전체 앱 기능 개요 (React Native + TypeScript)
<table>
    <tr><td>기능 영역</td><td>상세 내용</td></tr>
    <tr>
        <td>📁 로컬 이미지 탭</td>
        <td>- 앱 내부의 로컬 이미지 표시<br>- 그리드 뷰</td>         
    </tr>
    <tr>
        <td>☁️ 서버 이미지 탭</td>
        <td>- 서버에서 이미지 목록 로딩 (Spring Boot REST API)<br>
        - 이미지 클릭 시 원본 로드<br>
        - 업로드 기능 추가 (로컬 파일 선택 → 서버 전송)<br>
        - 그리드 뷰</td>
    </tr>
    <tr>
        <td>🧭 탭 UI 구성</td>
        <td>React Navigation을 통한 하단 탭 구조<br>
            Local / Server 탭 나눔</td>
    </tr>
    <tr>
        <td>🔧 기술스택</td>
        <td>React Native, TypeScript, Axios, FlatList, Native Modules<br>
Spring Boot (서버), JDK 21, Node.js 22 (클라이언트 개발)</td>
    </tr>
</table>

### 📐 전체 구조 계획
```cpp
📦 MyImageViewerApp
├── App.tsx                        // 탭 네비게이션
├── screens/
│   ├── LocalImagesScreen.tsx     // 로컬 이미지 탭
│   └── ServerImagesScreen.tsx    // 서버 이미지 탭
├── components/
│   └── ImageGrid.tsx             // 공통 그리드 컴포넌트 (선택사항)
├── api/
│   └── imageApi.ts               // axios 서버 통신 함수
└── types/
    └── ImageItem.ts              // 공통 이미지 타입 정의

```

### 🧩 기능별 세부 계획
1. 📁 로컬 이미지 탭
   * 앱 내 asset 또는 파일 시스템 이미지 표시
   * FlatList + numColumns로 그리드 뷰
   * 필요한 경우 react-native-fs, expo-media-library, CameraRoll 등 활용 가능  
2. ☁️ 서버 이미지 탭  
   * 🟢 목록 불러오기  
     * GET /images → 이미지 목록(JSON) 응답  
     * ImageItem: { id: string, thumbnailUrl: string }  
   * 🔵 이미지 전체 보기  
     * 클릭 시 GET /images/{id} 요청  
     * react-native-image-viewing 또는 Modal 등으로 전체보기 UI  
   * 🟡 업로드 기능
     * 이미지 선택 (ImagePicker 또는 FilePicker 사용)
     * POST /images로 multipart 업로드
     * 업로드 후 목록 새로고침

### 🛠 필요한 주요 라이브러리
|목적|패키지|메모|
|:---|:---|:---|
Navigation | @react-navigation/native, @react-navigation/bottom-tabs | 탭 UI |
|이미지 요청 | axios | API 통신 |
|이미지 선택 | react-native-image-picker or expo-image-picker | 업로드용 |
|전체보기 | react-native-image-viewing, react-native-modal | 이미지 클릭 시 사용 |
|그리드뷰 | 기본 FlatList + numColumns 사용 | Masonry 필요 없음

### 📚 서버(Spring Boot) 측 예정 API
|HTTP|경로|설명|
|:---|:---|:---|
|GET | /images | 이미지 목록 (썸네일) |
|GET | /images/{id} | 실제 이미지 바이트 스트림 |
|POST | /images | 이미지 업로드 (multipart/form-data) |
|DELETE | /images/{id} | 이미지 삭제 (선택사항) |

### 🧭 진행 순서 제안
|단계 | 설명 |
|:---|:---|
|✅ 1. 프로젝트 생성 | TypeScript 템플릿 사용 완료 |
|✅2. 탭 UI 구성 | App.tsx에서 탭 구조 만들기 |
|✅ 3. 로컬 이미지 탭 | 기본 이미지 표시 확인 |
|✅ 4. 서버 탭 목록 불러오기 | axios로 더미 API 연동 |
|✅ 5. 이미지 전체보기 기능 | |
|✅ 6. 업로드 기능 추가 | |
|✅ 7. 서버 API(Spring Boot) 개발 연결 | |

## Troubleshooting

## Learn More
