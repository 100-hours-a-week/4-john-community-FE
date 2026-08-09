# John Community Project Frontend

## Front-end 소개
- 팟캐스트를 스트리밍하면서 커뮤니티 이용자들끼리 자유롭게 토론하고 대화하는 커뮤니티 프로젝트입니다.
- AWS 서버리스 영상 인코딩(MediaConvert) 파이프라인 및 Presigned URL upload가 적용된 웹 커뮤니티 프론트엔드 서비스입니다

### Back end
- <a href="https://github.com/minjae196/ktb_community_practice">Back-end Github</a>

---


## 주요 특징 (Key Features)

- **Presigned URL 기반 S3 영상 업로드**
  - 백엔드 서버 부하(0%) 없이 브라우저에서 AWS S3 Raw 버킷으로 직접 초고속 업로드 (`PUT`)
  - `XMLHttpRequest` 기반 실시간 프로그레스 바 (0% ~ 100%) 제공
- **HLS (.m3u8) 동영상 스트리밍 재생**
  - AWS Elemental MediaConvert로 자동 변환된 HLS 멀티 비트레이트 동영상 스트리밍
  - `hls.js` 연동으로 PC, 모바일, 모든 브라우저에서 무단절 스트리밍 재생
- **사용자 인증 및 커뮤니티 기능**
  - 회원가입, 로그인, 프로필 수정, 비밀번호, 회원정보 변경 구현
  - 게시글 CRUD, 무한 스크롤 / 페이징 목록, 댓글 및 좋아요 기능
- **무중단 CI/CD 파이프라인**
  - GitHub Actions + Private Docker Registry + Docker Compose 기반의 CI/CD 무 중단 배포 구현

---

## 영상 업로드 & 스트리밍 아키텍처 (Video Upload Architecture)

```mermaid
sequenceDiagram
    autonumber
    actor User as 사용자 (브라우저)
    participant FE as 프론트엔드 (JS)
    participant BE as 백엔드 (Spring Boot)
    participant S3Raw as S3 원본 버킷
    participant Lambda as AWS Lambda
    participant MC as MediaConvert
    participant S3Origin as S3 Origin / CloudFront

    User->>FE: 동영상 파일 선택
    FE->>BE: GET /api/videos/presigned-url?extension=.mp4
    BE-->>FE: { presignedUrl, videoUrl } 반환 (0.01초 소요)
    FE->>S3Raw: Direct PUT 업로드 (프로그레스 바 0%~100%)
    
    Note over S3Raw, S3Origin: 백그라운드 서버리스 HLS 인코딩 파이프라인
    S3Raw->>Lambda: S3 ObjectCreated 이벤트 트리거
    Lambda->>MC: MediaConvert HLS 변환 요청
    MC->>S3Origin: HLS 변환 결과물 저장 (videos/UUID/UUID.m3u8)

    User->>FE: 게시글 작성 완료
    FE->>BE: POST /api/posts { postVideoUrl }
    FE->>S3Origin: hls.js 동영상 스트리밍 재생 
