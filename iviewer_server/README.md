## NestJS Setup
```sh
# install nest
npm i -g @nestjs/cli
# create new project
nest new project-name
# select package manager
>npm
 yarn
 pnpm
# run server (project root)
npm run start:dev
```
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# 🧪 NestJS 개발환경 구성 (VS Code)

## ✅ 1. NestJS 프로젝트 생성
프로젝트 만들기
```bash
npm i -g @nestjs/cli
nest new my-app
cd my-app
npm run start:dev
````

패키지 설치
```bash
npm install @nestjs/platform-express multer @types/multer uuid
npm install uuid
npm install --save-dev @types/uuid
npm install @nestjs/serve-static
# db
npm install @nestjs/typeorm typeorm pg
```

DB 설치 (postgres)
```sh
docker run --name my-postgres -e POSTGRES_PASSWORD=1234 -p 5432:5432 -d postgres
```
SQLTools + PostgreSQL Driver
* 🔍 VS Code Extension Marketplace 에서 아래 2개 검색해서 설치:
  * SQLTools👉 mtxr.sqltools
  * SQLTools PostgreSQL/Redshift Driver👉 mtxr.sqltools-driver-pg
  * Test Query : ‼️**Upper/Lowercase 혼용일 경우 "columnName"**‼️  
    [Postgres Query](./local-postgres.session.sql)

---

## 🛠️ 2. VS Code 추천 설정

`.vscode/settings.json` 예시:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/dist": true,
    "**/node_modules": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

* 저장 시 자동 포맷 및 린트 적용
* `dist`, `node_modules` 폴더 숨기기

---

## 💡 3. VS Code 확장 추천

| 확장 이름                            | 설명                         |
| -------------------------------- | -------------------------- |
| **ESLint**                       | NestJS 기본 린팅 도구            |
| **Prettier**                     | 코드 포매터 (ESLint와 함께 사용 권장)  |
| **NestJS Files**                 | NestJS 구조에 맞는 파일 템플릿 생성 도구 |
| **NestJS Snippets**              | NestJS 코드 자동완성 스니펫         |
| **Path Intellisense**            | 경로 자동완성                    |
| **Auto Import**                  | 자동 import 생성               |
| **DotENV**                       | `.env` 파일 문법 하이라이팅         |
| **Jest**                         | Nest의 기본 테스트 프레임워크 지원      |
| **REST Client / Thunder Client** | API 테스트용 도구 (Postman 대체)   |
| **GitLens**                      | Git 히스토리 및 블레임 보기          |

---

## 🐞 4. 디버깅 설정

`.vscode/launch.json` 예시 (NestJS 디버깅용):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "pwa-node",
      "request": "launch",
      "name": "NestJS Debug",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/main.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "TS_NODE_PROJECT": "tsconfig.build.json"
      }
    }
  ]
}
```

---

## 📁 5. 기본 NestJS 프로젝트 구조

```
src/
  ├── app.controller.ts     # 컨트롤러: 요청 처리
  ├── app.module.ts         # 루트 모듈
  ├── app.service.ts        # 서비스: 비즈니스 로직
  └── main.ts               # 앱 진입점
```

---

## ✅ 시작 체크리스트

* [x] NestJS CLI로 프로젝트 생성
* [x] ESLint + Prettier 설정
* [x] `.vscode/settings.json`, `launch.json` 구성
* [x] 코드 스니펫 및 디버깅 확장 설치
* [x] Thunder Client로 API 테스트

---

## 🔧 추가로 설정할 수 있는 항목

* [ ] Docker 기반 NestJS 개발환경
* [ ] Swagger 문서 자동 생성 (`@nestjs/swagger`)
* [ ] Prisma ORM + PostgreSQL 연동
* [ ] CI/CD 파이프라인 구성

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
