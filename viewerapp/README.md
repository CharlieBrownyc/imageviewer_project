# Image Viewer - React Native

## Getting Started
> **Note**:  
> node v22.17.1 , npm 10.9.2, yarn 1.22.22  
> react-native 0.80.2, Metro 0.82.5

#### Step by step Project
* RN command[🔗](./ReactNative.md)  
[빌드명령어 package.json](https://adjh54.tistory.com/565
> build & run

1. Create New Project  
	`npx @react-native-community/cli init imageviewer`
2. vscode `code .`
3. ❗Waiting importing project by vscode
	* Java: Gradle build...
4. [install dependency](#dep)
5. [build optimization](#opti)
6. Android Permission
  * AndroidManifest.xml
  ```xml
  <uses-permission android:name="android.permission.CAMERA"/>
  <uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
  <application
    android:usesCleartextTraffic="true"
    ...
  >
  ```
7. launch App
	`npx react-native run-android`
8. [Release build apk](#apk)
  ```bash
  react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
  ```
   

> clean & build  

```sh
# gradle
# cd android
# ./gradlew clean
# Metro cache clear
#npx react-native start --reset-cache
cd [react root]
npx react-native clean # all clean : android, metro, react-native, node_module, yarn ...
npm install
# build & run
npx react-native run-android  
```  


> install dependency package<a id="dep"></a>

```bash
npm install --save-dev @types/react
npm install --save-dev @types/react-native
npm install --save react-native-logs
npm install \
  @react-native-camera-roll/camera-roll \
  react-native-image-viewing \
  react-native-image-picker \
  react-native-image-crop-picker \
  react-native-reanimated
npm install \
  @react-navigation/native \
  @react-navigation/bottom-tabs \
  react-native-permissions 
npm install \
	axios \
  react-native-screens \
  react-native-safe-area-context \
  react-native-gesture-handler \
npm install react-native-svg \
  lucide-react-native
npm install react-native-progress
```


> builc optimization<a id="opti"></a>

*  Hermes 활성화 (iOS/Android 공통)  
`Hermes는 JavaScript 엔진으로, 앱의 성능과 빌드 시간을 최적화하는 데 도움을 줍니다. 기본적으로 활성화하지 않으면, React Native는 JavaScriptCore를 사용합니다.`
	* 기본으로 설정됨
	* gradle.properties`hermesEnabled=true`, android/app/build.gradle`dependencies-hermesEnabled`
* Gradle 캐시 설정 (Android)
	* gradle.properties  
	```yaml
	# 수정
	org.gradle.jvmargs=-Xmx4096m       # JVM 메모리 할당
	# 주석 해제
	org.gradle.parallel=true            # 병렬 빌드
	# 아래는 추가
	org.gradle.configureondemand=true  # 필요한 프로젝트만 설정하여 빌드 시간 단축
	org.gradle.daemon=true             # Gradle 데몬 활성화 (빌드 성능 개선)
	org.gradle.caching=true           # 빌드 캐시 활성화
	```

> 릴리즈 APK 파일 만들기 (로컬 설치용)<a id="apk"></a>
* 키스토어 만들기 -> 이 파일을 android/app/에 복사
  ```bash
  keytool -genkeypair -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
  ```
* Gradle 설정
  * android/gradle.properties
    ```properties
    MYAPP_UPLOAD_STORE_FILE=my-release-key.keystore
    MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
    MYAPP_UPLOAD_STORE_PASSWORD=********
    MYAPP_UPLOAD_KEY_PASSWORD=********

    ```
  * android/app/build.gradle
    ```properties
    android {
      ...
      signingConfigs {
        release {
          storeFile file(MYAPP_UPLOAD_STORE_FILE)
          storePassword MYAPP_UPLOAD_STORE_PASSWORD
          keyAlias MYAPP_UPLOAD_KEY_ALIAS
          keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }
      }
      buildTypes {
        release {
          signingConfig signingConfigs.release
          shrinkResources true
          minifyEnabled true
          proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
      }
    }
    ```
  * `npm install`
  * cd project_root/ : `npx react-native codegen`
  * `react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`
  * npx react-native build-android --mode=release
  
> run, build script (package.json)  

| 구성명령어(npm) | 구성 명령어(yarn) | 설명 |
| --- | --- | --- |
|npm run an	| yarn run an | 8081 포트에서 안드로이드 기기에 실행합니다 |
|npm run ios | yarn run ios | 8081 포트에서 iOS 기기에 실행합니다. |
|npm run clean | yarn run clean | 캐시를 제거하고 8081 포트로 재 실행합니다. |
|npm run an:clean | yarn run an:clean |Gradle 빌드된 파일들의 캐시를 초기화합니다. |
|npm run ios:clean | yarn run ios:clean | iOS 빌드된 파일들을 초기화합니다. |
|npm run build:apk | yarn run build:apk | 안드로이드 기기를 빌드하여 .apk 확장자의 파일을 생성합니다. |
|npm run build:aab | yarn run build:aab | 안드로이드 기기를 빌드하여 .aab 확장자의 파일을 생성합니다. |  
```json
"scripts": {
	"an": "npx react-native run-android --port 8081 APP_ENV=local",
	"ios": "react-native run-ios --port 8081 APP_ENV=local",
	"clean": "npx react-native start --port 8081 --reset-cache",
	"an:clean": "cd android 2>/dev/null && ./gradlew clean || (cd .. && cd android && ./gradlew clean)",
	"ios:clean": "cd ios 2>/dev/null && pod cache clean --all || (cd .. && cd ios && pod cache clean --all)",
	"build:apk": "cd android 2>/dev/null && ./gradlew assembleRelease || (cd .. && cd android && ./gradlew assembleRelease)",
	"build:aab": "cd android 2>/dev/null && ./gradlew bundleRelease || (cd .. && cd android && ./gradlew bundleRelease)"		
}
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

1. Build시 `Unable to load script...`
  ```yaml
  # 오류메세지
  Unable to load script. Make sure you're either running a Metro server (run 'react-native start') or that your bundle 'index.android.bundle' is packaged correctly for release.  

  # 빌드하기(배포시)
  ./gradlew assembleRelease <- 리눅스 기준
  gradlew.bat assembleRelease <- 윈도우 기준

  # 빌드하기(디버그시)
  ./gradlew assembleDebug <- 리눅스 기준
  gradlew.bat assembleDebuge <- 윈도우 기준

  # 빌드 후 디바이스에서 직접 테스트
  react-native run-android --variant=release

  # 오류발생
  Unable to load script. Make sure you're either running a Metro server (run 'react-native start') or that your bundle 'index.android.bundle' is packaged correctly for release.

  # 해결
  android\app\src\main\assets\모든 파일삭제

  # 아래 명령어 입력 후 엔터
  react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle

  # 아래 파일 생성여부 확인
  android\app\src\main\assets\index.android.bundle
  ```

## Learn More
