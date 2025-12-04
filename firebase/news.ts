// firebase/news.ts

export interface NewsItem {
  id: string;
  title: string;
  date: string;       // 작성일
  source: string;     // 출처
  link?: string;      // 외부 링크 (없을 수도 있음)
  period?: string;    // 🗓 행사 기간
  location?: string;  // 📍 장소
  content?: string;   // 본문 내용
}

//  [데이터] 2026년 마라톤 일정 & 꿀팁 
export const NEWS_DATA: NewsItem[] = [
  { 
    id: "1", 
    title: "🌅 2026 새해일출런 (1/1 개최)", 
    date: "2025.12.03", 
    period: "2026.01.01 (목)",
    location: "서울 영등포구 신정교 하부 육상트랙",
    link: "http://xn--zl2bt5ndwfh3g20k.kr/", 
    source: "대한생활체육마라톤협회"
  },
  { 
    id: "2", 
    title: "🏃‍♂️ 제20회 여수마라톤대회 접수 안내", 
    date: "2025.12.01", 
    period: "2026.01.11 (일)",
    location: "여수진남경기장 주경기장",
    link: "http://ysmarathon.co.kr/",
    source: "여수마라톤 조직위"
  },
  { 
    id: "3", 
    title: "🏅 2026 한강 서울 하프 마라톤", 
    date: "2025.11.28", 
    period: "2026.01.25 (일)",
    location: "상암 평화의공원 평화광장",
    link: "http://seoulhalfrun.kr/",
    source: "대회 사무국"
  },
  { 
    id: "4", 
    title: "❄️ 겨울철 야외 러닝 가이드 (복장/준비)", 
    date: "2025.11.25", 
    source: "RunningBuddy 꿀팁",
    // 링크(link) 없음 -> 버튼 안 나옴
    content: `겨울철 야외 러닝을 위해서는 얇은 옷을 겹쳐 입어 땀을 빠르게 배출하고, 장갑, 넥워머, 모자 등으로 체온이 떨어지기 쉬운 부위를 보호해야 합니다.

1. 체온 유지를 위한 복장
• 겹쳐 입기: 땀을 빨리 배출하고 체온을 유지할 수 있도록 얇은 옷을 여러 겹 겹쳐 입습니다.
• 보온 용품 착용: 손과 귀는 추위에 민감하므로 장갑과 귀마개를 착용합니다. 넥워머는 코와 귀까지 가려주어 보온 효과가 뛰어납니다.
• 방수 및 미끄럼 방지 신발: 눈이나 얼음 위에서도 안전하게 달릴 수 있는 신발을 선택합니다.

2. 러닝 전후의 준비
• 충분한 워밍업: 최소 10분 이상 충분히 몸을 데웁니다. 발목, 무릎, 고관절 등 관절을 풀어주고, 가볍게 조깅하는 것도 좋습니다.
• 코로 숨쉬기: 코로 숨을 쉬어 호흡기를 보호하고, 필요하다면 입과 코를 가려주어 찬 공기 흡입을 줄입니다.
• 수분 공급: 덥지 않더라도 운동 중에는 수분 섭취가 중요합니다. 5km 기준 약 300ml 정도의 물을 섭취합니다.

3. 달리는 중 주의사항
• 적절한 강도 유지: 체온이 급격히 떨어지지 않도록 자신의 체력에 맞는 적절한 강도로 운동합니다. 몸 상태가 좋지 않을 때는 무리하지 않습니다.
• 저체온증 주의: 천천히 달리는 경우 저체온증에 걸릴 수 있으니 주의하고, 특히 기온이 낮은 날에는 더욱 신경 써야 합니다.
• 체온 관리: 뛸 때 열이 나기 시작하면 미리 준비한 바람막이 등을 벗어 체온을 조절할 수 있습니다.

4. 마무리 및 추가 팁
• 마무리 운동: 운동 후에는 가볍게 스트레칭하며 근육을 풀어줍니다.
• 몸이 좋지 않을 땐 쉬기: 몸 상태가 좋지 않거나 몸살 기운이 있을 때는 야외 러닝을 피하고 휴식을 취합니다.`
  },
];

export async function getNewsList(): Promise<NewsItem[]> {
  return NEWS_DATA;
}

export async function getRecentNews(): Promise<NewsItem[]> {
  return NEWS_DATA.slice(0, 3);
}

export async function getNewsById(id: string) {
  return NEWS_DATA.find((item) => item.id === id) || null;
}

// 뉴스 작성 함수 (에러 방지용 더미 함수)
export async function addNews(input: {
  title: string;
  content: string;
  date: string;
  img?: string | null;
  category?: string;
}) {
  const newItem: NewsItem = {
    id: Date.now().toString(),
    title: input.title,
    date: input.date,
    content: input.content,
    source: "관리자 (임시)",
    link: "#", // 링크 없음
  };

  // 임시로 배열 맨 앞에 추가 (새로고침하면 사라짐)
  NEWS_DATA.unshift(newItem);
  
  return newItem;
}