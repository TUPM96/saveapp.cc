export const site = {
  name: 'SaveApp.cc',
  url: 'https://saveapp.cc',
  description:
    'SaveApp.cc giới thiệu danh sách ứng dụng của Thanh Truc Solutions, trạng thái phát hành và liên kết tải trên store.',
  owner: 'Thanh Truc Solutions',
  email: 'support@saveapp.cc'
};

export const apps = [
  {
    slug: 'koi',
    name: 'Koi',
    packageName: 'Đang cập nhật',
    category: 'Hẹn hò',
    tagline: 'App hẹn hò giúp kết nối những người có cùng gu sống và nhịp trò chuyện.',
    description:
      'Koi tập trung vào trải nghiệm hẹn hò nhẹ nhàng, hồ sơ rõ ràng và gợi ý kết nối dựa trên sở thích, vị trí và mục tiêu quan hệ.',
    icon: '/app-icons/koi.svg',
    status: 'Đang hoàn thiện',
    statusTone: 'accent',
    releaseChannel: 'Sắp ra mắt',
    installCount: 0,
    updatedAt: '7 thg 6, 2026',
    updatedAtMachine: '2026-06-07',
    platforms: ['Android', 'iOS'],
    features: [
      'Tạo hồ sơ cá nhân với ảnh, sở thích và mục tiêu hẹn hò.',
      'Gợi ý kết nối theo khoảng cách, độ tương đồng và trạng thái hoạt động.',
      'Trò chuyện riêng tư sau khi hai người cùng quan tâm.',
      'Bộ lọc an toàn để báo cáo, chặn và kiểm soát tương tác.'
    ],
    storeStatus: 'Sắp cập nhật link store chính thức',
    storeLinks: []
  },
  {
    slug: 'beautyiq',
    name: 'BeautyIQ: Cố Vấn Trang Điểm',
    packageName: 'com.beautyiq.app',
    category: 'Làm đẹp',
    tagline: 'Cố vấn trang điểm cá nhân với gợi ý phong cách theo khuôn mặt.',
    description:
      'BeautyIQ hỗ trợ người dùng chọn phong cách trang điểm, màu sắc và routine phù hợp với từng nhu cầu làm đẹp.',
    icon: '/app-icons/beautyiq.svg',
    status: 'Thử nghiệm khép kín',
    statusTone: 'success',
    releaseChannel: 'Closed testing',
    installCount: 0,
    updatedAt: '7 thg 6, 2026',
    updatedAtMachine: '2026-06-07',
    platforms: ['Android'],
    features: [
      'Gợi ý layout trang điểm theo dịp sử dụng.',
      'Tư vấn tông màu phù hợp với phong cách cá nhân.',
      'Theo dõi lịch sử tư vấn và lựa chọn yêu thích.'
    ],
    storeLinks: [
      {
        label: 'Google Play',
        url: 'https://play.google.com/store/apps/details?id=com.beautyiq.app'
      }
    ]
  },
  {
    slug: 'ichi',
    name: 'Ichi: Học tiếng Nhật dễ dàng',
    packageName: 'solutions.thanhtruc.ichi',
    category: 'Giáo dục',
    tagline: 'Ứng dụng học tiếng Nhật ngắn gọn, dễ duy trì mỗi ngày.',
    description:
      'Ichi giúp người học ôn từ vựng, mẫu câu và thói quen học tiếng Nhật bằng các bài học nhỏ, dễ theo dõi.',
    icon: '/app-icons/ichi.svg',
    status: 'Thử nghiệm khép kín',
    statusTone: 'success',
    releaseChannel: 'Closed testing',
    installCount: 0,
    updatedAt: '7 thg 6, 2026',
    updatedAtMachine: '2026-06-07',
    platforms: ['Android'],
    features: [
      'Bài học nhỏ theo chủ đề giao tiếp.',
      'Ôn tập từ vựng và cấu trúc câu căn bản.',
      'Theo dõi tiến độ học tập theo ngày.'
    ],
    storeLinks: [
      {
        label: 'Google Play',
        url: 'https://play.google.com/store/apps/details?id=solutions.thanhtruc.ichi'
      }
    ]
  },
  {
    slug: 'noka',
    name: 'Noka',
    packageName: 'com.noka.mobile',
    category: 'Tiện ích',
    tagline: 'Ứng dụng tiện ích di động đang trong giai đoạn bản nháp.',
    description:
      'Noka là sản phẩm đang hoàn thiện, tập trung vào trải nghiệm thao tác nhanh và quản lý tiện ích cá nhân.',
    icon: '/app-icons/noka.svg',
    status: 'Bản nháp',
    statusTone: 'muted',
    releaseChannel: 'Draft',
    installCount: 0,
    updatedAt: '6 thg 6, 2026',
    updatedAtMachine: '2026-06-06',
    platforms: ['Android'],
    features: [
      'Thiết kế tối giản cho thao tác nhanh.',
      'Cấu trúc sẵn sàng mở rộng thêm module tiện ích.',
      'Theo dõi trạng thái phát hành nội bộ.'
    ],
    storeLinks: [
      {
        label: 'Google Play',
        url: 'https://play.google.com/store/apps/details?id=com.noka.mobile'
      }
    ]
  },
  {
    slug: 'orin',
    name: 'Orin: Chat dễ dàng',
    packageName: 'orin.goldone.vn',
    category: 'Giao tiếp',
    tagline: 'Trò chuyện nhanh, đơn giản và dễ tiếp cận.',
    description:
      'Orin hướng tới trải nghiệm nhắn tin gọn gàng với luồng trò chuyện rõ ràng và thao tác thân thiện.',
    icon: '/app-icons/orin.svg',
    status: 'Thử nghiệm khép kín',
    statusTone: 'success',
    releaseChannel: 'Closed testing',
    installCount: 5,
    updatedAt: '7 thg 6, 2026',
    updatedAtMachine: '2026-06-07',
    platforms: ['Android'],
    features: [
      'Danh sách hội thoại dễ theo dõi.',
      'Gửi tin nhắn nhanh với giao diện tối giản.',
      'Tối ưu cho người dùng cần một app chat nhẹ.'
    ],
    storeLinks: [
      {
        label: 'Google Play',
        url: 'https://play.google.com/store/apps/details?id=orin.goldone.vn'
      }
    ]
  },
  {
    slug: 'pose',
    name: 'Pose: AI gợi ý tạo dáng',
    packageName: 'com.pose.camera',
    category: 'Ảnh & AI',
    tagline: 'AI gợi ý tạo dáng để chụp ảnh tự nhiên hơn.',
    description:
      'Pose hỗ trợ người dùng tìm ý tưởng tạo dáng, bố cục và phong cách chụp ảnh phù hợp với từng bối cảnh.',
    icon: '/app-icons/pose.svg',
    status: 'Thử nghiệm khép kín',
    statusTone: 'success',
    releaseChannel: 'Closed testing',
    installCount: 0,
    updatedAt: '7 thg 6, 2026',
    updatedAtMachine: '2026-06-07',
    platforms: ['Android'],
    features: [
      'Gợi ý dáng chụp theo phong cách ảnh.',
      'Hỗ trợ ý tưởng bố cục cho ảnh cá nhân.',
      'Lưu lại các gợi ý yêu thích để dùng lại.'
    ],
    storeLinks: [
      {
        label: 'Google Play',
        url: 'https://play.google.com/store/apps/details?id=com.pose.camera'
      }
    ]
  },
  {
    slug: 'signtalk',
    name: 'SignTalk: AI Sign to Speech',
    packageName: 'com.thanhtrucsolutions.signtalk',
    category: 'Trợ năng',
    tagline: 'AI hỗ trợ chuyển ngôn ngữ ký hiệu thành giọng nói.',
    description:
      'SignTalk hướng tới công cụ trợ năng giúp việc giao tiếp bằng ngôn ngữ ký hiệu trở nên dễ tiếp cận hơn.',
    icon: '/app-icons/signtalk.svg',
    status: 'Thử nghiệm khép kín',
    statusTone: 'success',
    releaseChannel: 'Closed testing',
    installCount: 0,
    updatedAt: '7 thg 6, 2026',
    updatedAtMachine: '2026-06-07',
    platforms: ['Android'],
    features: [
      'Nhận diện cử chỉ ký hiệu trong ngữ cảnh hỗ trợ.',
      'Chuyển kết quả sang giọng nói hoặc văn bản.',
      'Thiết kế cho các tình huống giao tiếp nhanh.'
    ],
    storeLinks: [
      {
        label: 'Google Play',
        url: 'https://play.google.com/store/apps/details?id=com.thanhtrucsolutions.signtalk'
      }
    ]
  }
];

export function getAppBySlug(slug) {
  return apps.find((app) => app.slug === slug);
}
