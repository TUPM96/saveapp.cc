// Bài viết cho blog SaveApp.cc.
// Đây là nội dung mẫu — chỉnh sửa thoải mái. Mỗi bài gồm:
//   slug, title, excerpt, date (hiển thị), dateMachine (YYYY-MM-DD, cho SEO),
//   tag, readingTime, cover (icon/ảnh), body (mảng block).
// Block hỗ trợ: { type: 'p', text }, { type: 'h2', text }, { type: 'ul', items: [] }.
// Dùng block thay vì HTML/markdown để render an toàn, không cần thư viện ngoài.

export const posts = [
  {
    slug: 'gioi-thieu-saveapp',
    title: 'SaveApp.cc — nơi theo dõi các ứng dụng của Thanh Truc Solutions',
    excerpt:
      'Một trang duy nhất tổng hợp trạng thái phát hành, nền tảng hỗ trợ và liên kết store cho mọi sản phẩm chúng tôi đang xây dựng.',
    date: '9 thg 7, 2026',
    dateMachine: '2026-07-09',
    tag: 'Giới thiệu',
    readingTime: '3 phút đọc',
    cover: '/app-icons/koi.svg',
    body: [
      {
        type: 'p',
        text: 'SaveApp.cc là trang giới thiệu chính thức cho các ứng dụng của Thanh Truc Solutions. Thay vì rải thông tin ở nhiều nơi, chúng tôi gom tất cả về một chỗ: mỗi app có trạng thái phát hành rõ ràng, nền tảng hỗ trợ và liên kết tải khi đã lên store.'
      },
      { type: 'h2', text: 'Vì sao có trang này?' },
      {
        type: 'p',
        text: 'Trong giai đoạn phát triển, một sản phẩm thường đi qua nhiều trạng thái: bản nháp, thử nghiệm khép kín, rồi mới phát hành rộng rãi. Người quan tâm cần biết app đang ở đâu trong hành trình đó và khi nào có thể trải nghiệm.'
      },
      { type: 'h2', text: 'Bạn tìm được gì ở đây?' },
      {
        type: 'ul',
        items: [
          'Danh sách ứng dụng kèm trạng thái và nền tảng hỗ trợ.',
          'Trang chi tiết từng app với tính năng chính và liên kết store.',
          'Blog cập nhật tiến độ, thông báo thử nghiệm và câu chuyện sản phẩm.'
        ]
      },
      {
        type: 'p',
        text: 'Chúng tôi sẽ tiếp tục cập nhật trang này theo từng cột mốc. Nếu bạn muốn hợp tác hoặc tham gia thử nghiệm sớm, hãy liên hệ qua email ở chân trang.'
      }
    ]
  },
  {
    slug: 'koi-app-hen-ho-sap-ra-mat',
    title: 'Koi — ứng dụng hẹn hò đang hoàn thiện',
    excerpt:
      'Koi hướng tới trải nghiệm hẹn hò nhẹ nhàng, hồ sơ rõ ràng và gợi ý kết nối dựa trên sở thích, vị trí và mục tiêu quan hệ.',
    date: '7 thg 7, 2026',
    dateMachine: '2026-07-07',
    tag: 'Sản phẩm',
    readingTime: '2 phút đọc',
    cover: '/app-icons/koi.svg',
    body: [
      {
        type: 'p',
        text: 'Koi là ứng dụng hẹn hò đang trong giai đoạn hoàn thiện. Mục tiêu của Koi rất đơn giản: giúp mọi người kết nối với những người có cùng gu sống và nhịp trò chuyện, thay vì chạy theo số lượng.'
      },
      { type: 'h2', text: 'Những gì đang được xây dựng' },
      {
        type: 'ul',
        items: [
          'Hồ sơ cá nhân với ảnh, sở thích và mục tiêu hẹn hò.',
          'Gợi ý kết nối theo khoảng cách, độ tương đồng và trạng thái hoạt động.',
          'Trò chuyện riêng tư sau khi hai người cùng quan tâm.',
          'Bộ lọc an toàn để báo cáo, chặn và kiểm soát tương tác.'
        ]
      },
      { type: 'h2', text: 'Khi nào có thể dùng thử?' },
      {
        type: 'p',
        text: 'Koi dự kiến hỗ trợ cả Android và iOS. Chúng tôi sẽ thông báo lịch thử nghiệm sớm ngay trên SaveApp.cc — theo dõi trang chi tiết của Koi để không bỏ lỡ liên kết tải khi mở.'
      }
    ]
  },
  {
    slug: 'lo-trinh-phat-hanh-2026',
    title: 'Lộ trình phát hành ứng dụng năm 2026',
    excerpt:
      'Cách chúng tôi đưa một app đi từ bản nháp đến khi lên store, và các sản phẩm đang ở từng giai đoạn.',
    date: '5 thg 7, 2026',
    dateMachine: '2026-07-05',
    tag: 'Hậu trường',
    readingTime: '4 phút đọc',
    cover: '/app-icons/ichi.svg',
    body: [
      {
        type: 'p',
        text: 'Mỗi ứng dụng của Thanh Truc Solutions đều đi qua một quy trình rõ ràng trước khi đến tay người dùng. Bài viết này giải thích các giai đoạn đó và cho biết sản phẩm nào đang ở đâu.'
      },
      { type: 'h2', text: 'Các giai đoạn' },
      {
        type: 'ul',
        items: [
          'Bản nháp: định hình ý tưởng và khung tính năng — ví dụ Noka.',
          'Thử nghiệm khép kín: mời nhóm nhỏ dùng thử, thu phản hồi — BeautyIQ, Ichi, Orin, Pose, SignTalk.',
          'Đang hoàn thiện: chuẩn bị mở rộng người dùng — Koi.',
          'Phát hành: có mặt trên store, cập nhật định kỳ.'
        ]
      },
      { type: 'h2', text: 'Chúng tôi ưu tiên điều gì?' },
      {
        type: 'p',
        text: 'Trải nghiệm gọn gàng và ổn định quan trọng hơn việc ra mắt vội. Vì vậy một số app ở lại giai đoạn thử nghiệm lâu hơn để hoàn thiện. Bạn luôn thấy trạng thái mới nhất của từng sản phẩm ngay trên trang chủ.'
      },
      {
        type: 'p',
        text: 'Theo dõi blog để nhận thông báo mỗi khi có app chuyển giai đoạn hoặc mở thử nghiệm mới.'
      }
    ]
  }
];

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}
