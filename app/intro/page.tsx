export default function IntroPage() {
  return (
    <section className="pt-6 pb-24 px-6 bg-white min-h-screen text-gray-800">

      {/* 메인 타이틀 */}
      <h1 className="text-3xl font-extrabold text-center leading-snug">
        함께 달리고<br />함께 성장하는
        <span className="block text-primary mt-2">RunningBuddy</span>
      </h1>

      {/* 서브 설명 */}
      <p className="text-center text-gray-600 mt-4 leading-relaxed">
        러닝을 사랑하는 사람들을 위한 커뮤니티 플랫폼<br />
        RunningBuddy를 소개합니다.
      </p>

      {/* 구분선 */}
      <div className="w-full h-[1px] bg-gray-200 my-10"></div>

      {/* 러닝버디 설명 섹션 */}
      <h2 className="text-xl font-bold mb-4">RunningBuddy란?</h2>
      <p className="text-gray-700 leading-relaxed">
        RunningBuddy는 러너들이 서로 연결되고, 함께 달리고,
        기록을 공유하며 성장할 수 있도록 만들어진 플랫폼입니다.
        쉽고 빠르게 번개 모임을 만들고, 리뷰를 올리고,
        내 러닝 기록을 관리할 수 있습니다.
      </p>

      {/* 구분선 */}
      <div className="w-full h-[1px] bg-gray-200 my-10"></div>

      {/* 핵심 가치 섹션 */}
      <h2 className="text-xl font-bold mb-6">RunningBuddy의 핵심 가치</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">1. 연결(Connection)</h3>
          <p className="text-gray-600 mt-1 leading-relaxed">
            러너들이 서로 쉽게 만나고, 함께 달릴 수 있는 환경을 제공합니다.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">2. 기록(Record)</h3>
          <p className="text-gray-600 mt-1 leading-relaxed">
            나의 러닝 기록·대회 기록을 한 곳에서 관리하고 확인할 수 있습니다.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">3. 소통(Communication)</h3>
          <p className="text-gray-600 mt-1 leading-relaxed">
            리뷰, 소식, 이벤트를 통해 다양한 러너들과 경험을 공유하세요.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">4. 성장(Growth)</h3>
          <p className="text-gray-600 mt-1 leading-relaxed">
            꾸준한 러닝과 커뮤니티 활동으로 함께 성장할 수 있도록 돕습니다.
          </p>
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-full h-[1px] bg-gray-200 my-10"></div>

      {/* 기능 블록 섹션 */}
      <h2 className="text-xl font-bold mb-6">이용 가능한 주요 기능</h2>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold">• 번개 모임 / 러닝 모집</h3>
          <p className="text-gray-600 mt-1">빠르고 간단하게 러닝 모임을 만들고 참여할 수 있습니다.</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold">• 리뷰 업로드</h3>
          <p className="text-gray-600 mt-1">사진과 함께 러닝 리뷰를 공유하여 소통할 수 있습니다.</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold">• 기록 관리</h3>
          <p className="text-gray-600 mt-1">내 기록과 대회 기록을 한 번에 관리할 수 있습니다.</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold">• 마라톤 소식</h3>
          <p className="text-gray-600 mt-1">다가오는 대회, 이벤트 정보를 빠르게 확인할 수 있습니다.</p>
        </div>
      </div>

      {/* 빈 공간 */}
      <div className="h-10"></div>
    </section>
  );
}
