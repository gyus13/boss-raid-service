# Order-service

<div align="center">
  <img src="https://img.shields.io/badge/node-16.17.0-339933?logo=node.js"> 
  <img src="https://img.shields.io/badge/NestJS-9.0.0-E0234E?logo=NestJS"> 
  <img src="https://img.shields.io/badge/TypeScript-4.4.5-3178C6?logo=typescript"> 
  <img src="https://img.shields.io/badge/Swagger-6.1.0-DC382D?logo=swagger"> 
  <img src="https://img.shields.io/badge/TypeORM-0.3.9-010101"> 
</div>

## 소개

## 1. 서비스 개요

- 보스레이드 api 입니다.
- 보스레이드 관련 정보를 cacheData에 넣어서 빠르게 조회가 가능합니다.

## 2. 구현 사항

### 1. 유저 도메인

#### 1. 유저 생성 api
- 유저를 생성 합니다.

#### 2. 유저 조회 api
- path parameter로 userId를 담아 보내준 후, userId를 갖고있는 해당 값을 리턴해줍니다.

#### 3. 보스레이드 상태 조회 api
- 보스레이드를 입장하기 위해서 현재 레이드의 상태를 조회합니다.
- 가장 최근에 입장한 기록과 비교하여 기록이 없거나, 입장시간이 지났다면 canEnter: false를 리턴 해줍니다.
- 
### 2. ERD

<img width="785" alt="스크린샷 2022-09-01 오후 10 44 18" src="https://user-images.githubusercontent.com/65529348/191494396-43d4e2a9-d537-4a35-b530-92330bf2e781.png">
</br>

### 3. Swagger
- swagger 문서로 api를 테스트 하고, 사용할 파라미터 그에따른 리스폰스를 확인할 수 있습니다.
- localhost:3000/docs

# 참조문서

## 📌 [개발 컨벤션 - 노션페이지](https://www.notion.so/devksanbal/9da9e2986a634b07a9615dd4298af006)