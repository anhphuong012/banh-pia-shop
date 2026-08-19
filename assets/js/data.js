// const products = [
//   {
//     id: 1,
//     slug: "banh-pia-kim-sa",
//     name: "Bánh Pía Kim Sa",
//     category: "Pía Kim Sa",
//     price: 180000,
//     oldPrice: 220000,
//     discount: 18,
//     stock: 50,
//     sold: "900",
//     rating: 3.6,
//     reviewCount: 128,
//     image: "assets/images/products/pia1.png",
//     images: [
//       "assets/images/products/pia1.png",
//       "assets/images/products/pia1_1.png",
//       "assets/images/products/pia1_2.png",
//     ],
//     shortDescription: "Hộp 12 bánh • 480g",
//     description:
//       "Bánh Pía Kim Sa với lớp vỏ béo ngậy, nhân trứng muối tan chảy dẻo mịn béo bùi khó cưỡng.",
//     ingredients: ["Bột mì", "Đậu xanh", "Trứng muối", "Sữa đặc", "Bơ thực vật"],
//     isFreeShip: true,
//     isHot: true,
//     isNew: false,
//   },
//   {
//     id: 11,
//     slug: "banh-pia-hat-sen",
//     name: "Bánh Pía Hạt Sen",
//     category: "Hạt Sen",
//     price: 165000,
//     oldPrice: 195000,
//     discount: 15,
//     stock: 35,
//     sold: 95,
//     rating: 4.6,
//     sold: "1.2k",

//     discount: 18,
//     reviewCount: 44,
//     image: "assets/images/products/sen1.png",
//     images: [
//       "assets/images/products/sen1.png",
//       "assets/images/products/sen1_1.png",
//       "assets/images/products/sen1_2.png",
//     ],
//     shortDescription: "Hộp 6 bánh",
//     description: "Nhân hạt sen thanh nhẹ, ít ngọt.",
//     ingredients: [
//       "Bột mì",
//       "Hạt sen tươi",
//       "Đường tinh luyện",
//       "Dầu ăn",
//       "Mứt bí",
//     ],
//     isFreeShip: true,
//     isHot: false,
//     isNew: false,
//   },

//   {
//     id: 12,
//     slug: "banh-pia-socola",
//     name: "Bánh Pía Socola",
//     category: "Socola",
//     price: 170000,
//     oldPrice: 205000,
//     discount: 17,
//     stock: 40,
//     sold: 130,
//     rating: 4.8,
//     sold: "1.4k",

//     discount: 18,
//     reviewCount: 59,
//     image: "assets/images/products/socola1.png",
//     images: [
//       "assets/images/products/socola1.png",
//       "assets/images/products/socola1_1.png",
//       "assets/images/products/socola1_2.png",
//     ],
//     shortDescription: "Hộp 6 bánh",
//     description: "Kết hợp giữa bánh pía truyền thống và socola.",
//     ingredients: [
//       "Bột mì",
//       "Bột cacao / Socola",
//       "Đậu xanh",
//       "Đường",
//       "Bơ thực vật",
//     ],
//     isFreeShip: true,
//     isHot: false,
//     isNew: true,
//   },

//   {
//     id: 13,
//     slug: "banh-pia-matcha",
//     name: "Bánh Pía Matcha",
//     category: "Matcha",
//     price: 175000,
//     oldPrice: 210000,
//     discount: 16,
//     stock: 37,
//     sold: 110,
//     rating: 4.7,
//     sold: "1.6k",

//     discount: 18,
//     reviewCount: 53,
//     image: "assets/images/products/matcha1.png",
//     images: [
//       "assets/images/products/matcha1.png",
//       "assets/images/products/matcha1_1.png",
//       "assets/images/products/matcha1_2.png",
//     ],
//     shortDescription: "Hộp 6 bánh",
//     description: "Matcha Nhật Bản kết hợp nhân đậu xanh.",
//     ingredients: [
//       "Bột mì",
//       "Bột trà xanh Matcha",
//       "Đậu xanh",
//       "Đường",
//       "Dầu thực vật",
//     ],
//     isFreeShip: true,
//     isHot: false,
//     isNew: true,
//   },

//   {
//     id: 14,
//     slug: "banh-pia-pho-mai",
//     name: "Bánh Pía Phô Mai",
//     category: "Phô Mai",
//     price: 195000,
//     oldPrice: 225000,
//     discount: 13,
//     stock: 33,
//     sold: 170,
//     rating: 4.7,
//     sold: "2k",

//     discount: 18,
//     reviewCount: 66,
//     image: "assets/images/products/phomai1.png",
//     images: [
//       "assets/images/products/phomai1.png",
//       "assets/images/products/phomai1_1.png",
//       "assets/images/products/phomai1_2.png",
//     ],
//     shortDescription: "Hộp 6 bánh",
//     description: "Nhân phô mai béo ngậy hòa quyện cùng lớp vỏ mềm.",
//     ingredients: [
//       "Bột mì",
//       "Phô mai Cheddar/Cream cheese",
//       "Đậu xanh",
//       "Sữa tươi",
//       "Bơ",
//     ],
//     isFreeShip: true,
//     isHot: true,
//     isNew: false,
//   },

//   {
//     id: 15,
//     slug: "banh-pia-dua",
//     name: "Bánh Pía Dừa",
//     category: "Dừa",
//     price: 145000,
//     oldPrice: 175000,
//     discount: 17,
//     stock: 45,
//     sold: 86,
//     rating: 4.5,
//     sold: "200",

//     discount: 18,
//     reviewCount: 35,
//     image: "assets/images/products/dua1.png",
//     images: [
//       "assets/images/products/dua1.png",
//       "assets/images/products/dua1_1.png",
//       "assets/images/products/dua1_2.png",
//     ],
//     shortDescription: "Hộp 6 bánh",
//     description: "Nhân dừa thơm dịu, phù hợp trẻ nhỏ.",
//     ingredients: ["Bột mì", "Cơm dừa nạo", "Đậu xanh", "Nước cốt dừa", "Đường"],
//     isFreeShip: true,
//     isHot: false,
//     isNew: false,
//   },

//   {
//     id: 16,
//     slug: "banh-pia-thap-cam-cao-cap",
//     name: "Bánh Pía Thập Cẩm Cao Cấp",
//     category: "Thập Cẩm",
//     price: 285000,
//     oldPrice: 330000,
//     discount: 14,
//     stock: 22,
//     sold: 150,
//     rating: 4.9,
//     sold: "1.2k",

//     discount: 18,
//     reviewCount: 84,
//     image: "assets/images/products/thapcam1.png",
//     images: [
//       "assets/images/products/thapcam1.png",
//       "assets/images/products/thapcam1_1.png",
//       "assets/images/products/thapcam1_2.png",
//     ],
//     shortDescription: "Hộp quà cao cấp",
//     description: "Thích hợp làm quà biếu với bao bì sang trọng.",
//     ingredients: ["Bột mì", "Lạp xưởng", "Hạt điều", "Mứt bí", "Trứng muối"],
//     isFreeShip: true,
//     isHot: true,
//     isNew: false,
//   },

//   {
//     id: 17,
//     slug: "banh-pia-it-duong",
//     name: "Bánh Pía Ít Đường",
//     category: "Healthy",
//     price: 165000,
//     oldPrice: 190000,
//     discount: 13,
//     stock: 50,
//     sold: 240,
//     rating: 4.8,
//     sold: "1.5k",

//     discount: 18,
//     reviewCount: 92,
//     image: "assets/images/products/itduong1.png",
//     images: [
//       "assets/images/products/itduong1.png",
//       "assets/images/products/itduong1_1.png",
//       "assets/images/products/itduong1_2.png",
//     ],
//     shortDescription: "Hộp 6 bánh",
//     description: "Giảm lượng đường, phù hợp người ăn kiêng.",
//     ingredients: [
//       "Bột mì nguyên cám",
//       "Đậu xanh",
//       "Đường Isomalt ăn kiêng",
//       "Dầu thực vật",
//       "Hạt dưa",
//     ],
//     isFreeShip: true,
//     isHot: false,
//     isNew: true,
//   },

//   {
//     id: 18,
//     slug: "banh-pia-me-den",
//     name: "Bánh Pía Mè Đen",
//     category: "Mè Đen",
//     price: 175000,
//     oldPrice: 205000,
//     discount: 15,
//     stock: 36,
//     sold: 102,
//     rating: 4.7,
//     sold: "1.1k",

//     discount: 18,
//     reviewCount: 48,
//     image: "assets/images/products/meden1.png",
//     images: [
//       "assets/images/products/meden1.png",
//       "assets/images/products/meden1_1.png",
//       "assets/images/products/meden1_2.png",
//     ],
//     shortDescription: "Hộp 6 bánh",
//     description: "Nhân mè đen thơm béo, giàu dinh dưỡng.",
//     ingredients: ["Bột mì", "Mè đen", "Đậu xanh", "Đường", "Dầu thực vật"],
//     isFreeShip: true,
//     isHot: false,
//     isNew: false,
//   },

//   {
//     id: 19,
//     slug: "banh-pia-truyen-thong",
//     name: "Bánh Pía Truyền Thống",
//     category: "Truyền Thống",
//     price: 135000,
//     oldPrice: 160000,
//     discount: 16,
//     stock: 65,
//     sold: 650,
//     rating: 5,
//     sold: "5k",

//     discount: 18,
//     reviewCount: 256,
//     image: "assets/images/products/truyenthong1.png",
//     images: [
//       "assets/images/products/truyenthong1.png",
//       "assets/images/products/truyenthong1_1.png",
//       "assets/images/products/truyenthong1_2.png",
//     ],
//     shortDescription: "Hộp 6 bánh",
//     description: "Hương vị truyền thống được yêu thích nhiều năm.",
//     ingredients: ["Bột mì", "Đậu xanh", "Sầu riêng", "Trứng muối", "Mỡ heo"],
//     isFreeShip: true,
//     isHot: true,
//     isNew: false,
//   },

//   {
//     id: 20,
//     slug: "banh-pia-premium",
//     name: "Bánh Pía Premium",
//     category: "Premium",
//     price: 320000,
//     oldPrice: 370000,
//     discount: 14,
//     stock: 18,
//     sold: 95,
//     rating: 5,
//     sold: "4k",

//     discount: 18,
//     reviewCount: 41,
//     image: "assets/images/products/premium1.png",
//     images: [
//       "assets/images/products/premium1.png",
//       "assets/images/products/premium1_1.png",
//       "assets/images/products/premium1_2.png",
//     ],
//     shortDescription: "Hộp quà cao cấp",
//     description: "Phiên bản giới hạn với nguyên liệu tuyển chọn.",
//     ingredients: [
//       "Bột mì thượng hạng",
//       "Sầu riêng Ri6",
//       "Trứng muối tuyển chọn",
//       "Đậu xanh",
//       "Bơ Pháp",
//     ],
//     isFreeShip: true,
//     isHot: true,
//     isNew: true,
//   },
// ];
const products = [
  {
    id: 1,
    slug: "banh-pia-kim-sa",
    name: "Bánh Pía Kim Sa",
    category: "Pía Kim Sa",
    taste: "Béo ngậy, mặn ngọt hài hòa",
    price: 180000,
    oldPrice: 220000,
    discount: 18,
    stock: 50,
    sold: "900",
    rating: 3.6,
    reviewCount: 128,
    image: "assets/images/products/pia1.png",
    images: [
      "assets/images/products/pia1.png",
      "assets/images/products/pia1_1.png",
      "assets/images/products/pia1_2.png",
    ],
    shortDescription: "Hộp 12 bánh • 480g",
    description:
      "Bánh Pía Kim Sa với lớp vỏ béo ngậy, nhân trứng muối tan chảy dẻo mịn béo bùi khó cưỡng.",
    ingredients: ["Bột mì", "Đậu xanh", "Trứng muối", "Sữa đặc", "Bơ thực vật"],
    isFreeShip: true,
    isHot: true,
    isNew: false,
  },
  {
    id: 11,
    slug: "banh-pia-hat-sen",
    name: "Bánh Pía Hạt Sen",
    category: "Hạt Sen",
    taste: "Thanh nhẹ, bùi dịu, ít ngọt",
    price: 165000,
    oldPrice: 195000,
    discount: 18,
    stock: 35,
    rating: 4.6,
    sold: "1.2k",
    reviewCount: 44,
    image: "assets/images/products/sen1.png",
    images: [
      "assets/images/products/sen1.png",
      "assets/images/products/sen1_1.png",
      "assets/images/products/sen1_2.png",
    ],
    shortDescription: "Hộp 6 bánh",
    description: "Nhân hạt sen thanh nhẹ, ít ngọt.",
    ingredients: [
      "Bột mì",
      "Hạt sen tươi",
      "Đường tinh luyện",
      "Dầu ăn",
      "Mứt bí",
    ],
    isFreeShip: true,
    isHot: false,
    isNew: false,
  },
  {
    id: 12,
    slug: "banh-pia-socola",
    name: "Bánh Pía Socola",
    category: "Socola",
    taste: "Đắng nhẹ, đậm đà Socola",
    price: 170000,
    oldPrice: 205000,
    discount: 18,
    stock: 40,
    rating: 4.8,
    sold: "1.4k",
    reviewCount: 59,
    image: "assets/images/products/socola1.png",
    images: [
      "assets/images/products/socola1.png",
      "assets/images/products/socola1_1.png",
      "assets/images/products/socola1_2.png",
    ],
    shortDescription: "Hộp 6 bánh",
    description: "Kết hợp giữa bánh pía truyền thống và socola.",
    ingredients: [
      "Bột mì",
      "Bột cacao / Socola",
      "Đậu xanh",
      "Đường",
      "Bơ thực vật",
    ],
    isFreeShip: true,
    isHot: false,
    isNew: true,
  },
  {
    id: 13,
    slug: "banh-pia-matcha",
    name: "Bánh Pía Matcha",
    category: "Matcha",
    taste: "Thơm trà xanh, chát nhẹ hậu ngọt",
    price: 175000,
    oldPrice: 210000,
    discount: 18,
    stock: 37,
    rating: 4.7,
    sold: "1.6k",
    reviewCount: 53,
    image: "assets/images/products/matcha1.png",
    images: [
      "assets/images/products/matcha1.png",
      "assets/images/products/matcha1_1.png",
      "assets/images/products/matcha1_2.png",
    ],
    shortDescription: "Hộp 6 bánh",
    description: "Matcha Nhật Bản kết hợp nhân đậu xanh.",
    ingredients: [
      "Bột mì",
      "Bột trà xanh Matcha",
      "Đậu xanh",
      "Đường",
      "Dầu thực vật",
    ],
    isFreeShip: true,
    isHot: false,
    isNew: true,
  },
  {
    id: 14,
    slug: "banh-pia-pho-mai",
    name: "Bánh Pía Phô Mai",
    category: "Phô Mai",
    taste: "Mặn mặn, béo ngậy thơm nồng phô mai",
    price: 195000,
    oldPrice: 225000,
    discount: 18,
    stock: 33,
    rating: 4.7,
    sold: "2k",
    reviewCount: 66,
    image: "assets/images/products/phomai1.png",
    images: [
      "assets/images/products/phomai1.png",
      "assets/images/products/phomai1_1.png",
      "assets/images/products/phomai1_2.png",
    ],
    shortDescription: "Hộp 6 bánh",
    description: "Nhân phô mai béo ngậy hòa quyện cùng lớp vỏ mềm.",
    ingredients: [
      "Bột mì",
      "Phô mai Cheddar/Cream cheese",
      "Đậu xanh",
      "Sữa tươi",
      "Bơ",
    ],
    isFreeShip: true,
    isHot: true,
    isNew: false,
  },
  {
    id: 15,
    slug: "banh-pia-dua",
    name: "Bánh Pía Dừa",
    category: "Dừa",
    taste: "Ngọt thanh, béo dịu thơm mùi dừa tươi",
    price: 145000,
    oldPrice: 175000,
    discount: 18,
    stock: 45,
    rating: 4.5,
    sold: "200",
    reviewCount: 35,
    image: "assets/images/products/dua1.png",
    images: [
      "assets/images/products/dua1.png",
      "assets/images/products/dua1_1.png",
      "assets/images/products/dua1_2.png",
    ],
    shortDescription: "Hộp 6 bánh",
    description: "Nhân dừa thơm dịu, phù hợp trẻ nhỏ.",
    ingredients: ["Bột mì", "Cơm dừa nạo", "Đậu xanh", "Nước cốt dừa", "Đường"],
    isFreeShip: true,
    isHot: false,
    isNew: false,
  },
  {
    id: 16,
    slug: "banh-pia-thap-cam-cao-cap",
    name: "Bánh Pía Thập Cẩm Cao Cấp",
    category: "Thập Cẩm",
    taste: "Đậm đà mặn ngọt, bùi ngậy tổng hợp",
    price: 285000,
    oldPrice: 330000,
    discount: 18,
    stock: 22,
    rating: 4.9,
    sold: "1.2k",
    reviewCount: 84,
    image: "assets/images/products/thapcam1.png",
    images: [
      "assets/images/products/thapcam1.png",
      "assets/images/products/thapcam1_1.png",
      "assets/images/products/thapcam1_2.png",
    ],
    shortDescription: "Hộp quà cao cấp",
    description: "Thích hợp làm quà biếu với bao bì sang trọng.",
    ingredients: ["Bột mì", "Lạp xưởng", "Hạt điều", "Mứt bí", "Trứng muối"],
    isFreeShip: true,
    isHot: true,
    isNew: false,
  },
  {
    id: 17,
    slug: "banh-pia-it-duong",
    name: "Bánh Pía Ít Đường",
    category: "Healthy",
    taste: "Ngọt nhẹ, bùi tự nhiên",
    price: 165000,
    oldPrice: 190000,
    discount: 18,
    stock: 50,
    rating: 4.8,
    sold: "1.5k",
    reviewCount: 92,
    image: "assets/images/products/itduong1.png",
    images: [
      "assets/images/products/itduong1.png",
      "assets/images/products/itduong1_1.png",
      "assets/images/products/itduong1_2.png",
    ],
    shortDescription: "Hộp 6 bánh",
    description: "Giảm lượng đường, phù hợp người ăn kiêng.",
    ingredients: [
      "Bột mì nguyên cám",
      "Đậu xanh",
      "Đường Isomalt ăn kiêng",
      "Dầu thực vật",
      "Hạt dưa",
    ],
    isFreeShip: true,
    isHot: false,
    isNew: true,
  },
  {
    id: 18,
    slug: "banh-pia-me-den",
    name: "Bánh Pía Mè Đen",
    category: "Mè Đen",
    taste: "Thơm nồng mè đen, ngọt bùi đằm thắm",
    price: 175000,
    oldPrice: 205000,
    discount: 18,
    stock: 36,
    rating: 4.7,
    sold: "1.1k",
    reviewCount: 48,
    image: "assets/images/products/meden1.png",
    images: [
      "assets/images/products/meden1.png",
      "assets/images/products/meden1_1.png",
      "assets/images/products/meden1_2.png",
    ],
    shortDescription: "Hộp 6 bánh",
    description: "Nhân mè đen thơm béo, giàu dinh dưỡng.",
    ingredients: ["Bột mì", "Mè đen", "Đậu xanh", "Đường", "Dầu thực vật"],
    isFreeShip: true,
    isHot: false,
    isNew: false,
  },
  {
    id: 19,
    slug: "banh-pia-truyen-thong",
    name: "Bánh Pía Truyền Thống",
    category: "Truyền Thống",
    taste: "Thơm nức sầu riêng, béo ngậy trứng muối",
    price: 135000,
    oldPrice: 160000,
    discount: 18,
    stock: 65,
    rating: 5,
    sold: "5k",
    reviewCount: 256,
    image: "assets/images/products/truyenthong1.png",
    images: [
      "assets/images/products/truyenthong1.png",
      "assets/images/products/truyenthong1_1.png",
      "assets/images/products/truyenthong1_2.png",
    ],
    shortDescription: "Hộp 6 bánh",
    description: "Hương vị truyền thống được yêu thích nhiều năm.",
    ingredients: ["Bột mì", "Đậu xanh", "Sầu riêng", "Trứng muối", "Mỡ heo"],
    isFreeShip: true,
    isHot: true,
    isNew: false,
  },
  {
    id: 20,
    slug: "banh-pia-premium",
    name: "Bánh Pía Premium",
    category: "Premium",
    taste: "Béo ngậy đậm đà, vị sầu riêng Ri6 đậm sâu",
    price: 320000,
    oldPrice: 370000,
    discount: 18,
    stock: 18,
    rating: 5,
    sold: "4k",
    reviewCount: 41,
    image: "assets/images/products/premium1.png",
    images: [
      "assets/images/products/premium1.png",
      "assets/images/products/premium1_1.png",
      "assets/images/products/premium1_2.png",
    ],
    shortDescription: "Hộp quà cao cấp",
    description: "Phiên bản giới hạn với nguyên liệu tuyển chọn.",
    ingredients: [
      "Bột mì thượng hạng",
      "Sầu riêng Ri6",
      "Trứng muối tuyển chọn",
      "Đậu xanh",
      "Bơ Pháp",
    ],
    isFreeShip: true,
    isHot: true,
    isNew: true,
  },
];
const deliveryData = {
  shop: {
    name: "Tân Huê Viên",
    address: "153 Quốc lộ 1A, Phường 7, TP. Sóc Trăng, Sóc Trăng",
  },

  areas: [
    // ==============================
    // ĐÔNG NAM BỘ
    // ==============================

    {
      name: "TP. Hồ Chí Minh",
      keywords: [
        "ho chi minh",
        "tp ho chi minh",
        "tphcm",
        "tp hcm",
        "hcm",
        "sai gon",
        "saigon",
      ],
      fee: 40000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Bình Dương",
      keywords: ["binh duong", "thu dau mot"],
      fee: 40000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Đồng Nai",
      keywords: ["dong nai", "bien hoa"],
      fee: 40000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Bà Rịa - Vũng Tàu",
      keywords: ["ba ria", "ba ria vung tau", "vung tau"],
      fee: 45000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Tây Ninh",
      keywords: ["tay ninh"],
      fee: 45000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Bình Phước",
      keywords: ["binh phuoc", "dong xoai"],
      fee: 45000,
      deliveryTime: "2–3 ngày",
    },

    // ==============================
    // ĐỒNG BẰNG SÔNG CỬU LONG
    // ==============================

    {
      name: "Sóc Trăng",
      keywords: ["soc trang", "tp soc trang", "thanh pho soc trang"],
      fee: 20000,
      deliveryTime: "1 ngày",
    },

    {
      name: "Cần Thơ",
      keywords: [
        "can tho",
        "tp can tho",
        "ninh kieu",
        "binh thuy",
        "cai rang",
        "o mon",
        "thot not",
      ],
      fee: 30000,
      deliveryTime: "1–2 ngày",
    },

    {
      name: "Hậu Giang",
      keywords: ["hau giang", "vi thanh", "nga bay"],
      fee: 30000,
      deliveryTime: "1–2 ngày",
    },

    {
      name: "Bạc Liêu",
      keywords: ["bac lieu", "tp bac lieu"],
      fee: 30000,
      deliveryTime: "1–2 ngày",
    },

    {
      name: "Cà Mau",
      keywords: ["ca mau", "tp ca mau"],
      fee: 35000,
      deliveryTime: "1–2 ngày",
    },

    {
      name: "An Giang",
      keywords: ["an giang", "long xuyen", "chau doc", "tan chau"],
      fee: 35000,
      deliveryTime: "1–2 ngày",
    },

    {
      name: "Kiên Giang",
      keywords: ["kien giang", "rach gia", "ha tien", "phu quoc"],
      fee: 40000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Đồng Tháp",
      keywords: ["dong thap", "cao lanh", "sa dec"],
      fee: 30000,
      deliveryTime: "1–2 ngày",
    },

    {
      name: "Tiền Giang",
      keywords: ["tien giang", "my tho", "cai lay"],
      fee: 30000,
      deliveryTime: "1–2 ngày",
    },

    {
      name: "Bến Tre",
      keywords: ["ben tre", "mo cay"],
      fee: 30000,
      deliveryTime: "1–2 ngày",
    },

    {
      name: "Trà Vinh",
      keywords: ["tra vinh", "tp tra vinh"],
      fee: 30000,
      deliveryTime: "1–2 ngày",
    },

    {
      name: "Vĩnh Long",
      keywords: ["vinh long", "tp vinh long"],
      fee: 30000,
      deliveryTime: "1–2 ngày",
    },

    // ==============================
    // TÂY NGUYÊN
    // ==============================

    {
      name: "Đắk Lắk",
      keywords: ["dak lak", "daklak", "buon ma thuot"],
      fee: 45000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Đắk Nông",
      keywords: ["dak nong", "gia nghia"],
      fee: 45000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Lâm Đồng",
      keywords: ["lam dong", "da lat", "bao loc"],
      fee: 45000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Gia Lai",
      keywords: ["gia lai", "pleiku"],
      fee: 50000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Kon Tum",
      keywords: ["kon tum"],
      fee: 50000,
      deliveryTime: "2–3 ngày",
    },

    // ==============================
    // DUYÊN HẢI NAM TRUNG BỘ
    // ==============================

    {
      name: "Đà Nẵng",
      keywords: ["da nang", "tp da nang"],
      fee: 45000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Quảng Nam",
      keywords: ["quang nam", "tam ky", "hoi an"],
      fee: 45000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Quảng Ngãi",
      keywords: ["quang ngai"],
      fee: 50000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Bình Định",
      keywords: ["binh dinh", "quy nhon"],
      fee: 50000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Phú Yên",
      keywords: ["phu yen", "tuy hoa"],
      fee: 50000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Khánh Hòa",
      keywords: ["khanh hoa", "nha trang", "cam ranh"],
      fee: 50000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Ninh Thuận",
      keywords: ["ninh thuan", "phan rang"],
      fee: 50000,
      deliveryTime: "2–3 ngày",
    },

    {
      name: "Bình Thuận",
      keywords: ["binh thuan", "phan thiet"],
      fee: 50000,
      deliveryTime: "2–3 ngày",
    },

    // ==============================
    // BẮC TRUNG BỘ
    // ==============================

    {
      name: "Thanh Hóa",
      keywords: ["thanh hoa"],
      fee: 55000,
      deliveryTime: "3–4 ngày",
    },

    {
      name: "Nghệ An",
      keywords: ["nghe an", "vinh"],
      fee: 55000,
      deliveryTime: "3–4 ngày",
    },

    {
      name: "Hà Tĩnh",
      keywords: ["ha tinh"],
      fee: 55000,
      deliveryTime: "3–4 ngày",
    },

    {
      name: "Quảng Bình",
      keywords: ["quang binh", "dong hoi"],
      fee: 55000,
      deliveryTime: "3–4 ngày",
    },

    {
      name: "Quảng Trị",
      keywords: ["quang tri", "dong ha"],
      fee: 55000,
      deliveryTime: "3–4 ngày",
    },

    {
      name: "Thừa Thiên Huế",
      keywords: ["thua thien hue", "hue"],
      fee: 55000,
      deliveryTime: "3–4 ngày",
    },

    // ==============================
    // ĐỒNG BẰNG SÔNG HỒNG
    // ==============================

    {
      name: "Hà Nội",
      keywords: ["ha noi", "hanoi", "thu do"],
      fee: 50000,
      deliveryTime: "3–4 ngày",
    },

    {
      name: "Hải Phòng",
      keywords: ["hai phong"],
      fee: 55000,
      deliveryTime: "3–4 ngày",
    },

    {
      name: "Quảng Ninh",
      keywords: ["quang ninh", "ha long", "mong cai"],
      fee: 55000,
      deliveryTime: "3–4 ngày",
    },

    {
      name: "Bắc Ninh",
      keywords: ["bac ninh"],
      fee: 55000,
      deliveryTime: "3–4 ngày",
    },

    {
      name: "Hưng Yên",
      keywords: ["hung yen"],
      fee: 55000,
      deliveryTime: "3–4 ngày",
    },

    {
      name: "Hải Dương",
      keywords: ["hai duong"],
      fee: 55000,
      deliveryTime: "3–4 ngày",
    },

    {
      name: "Nam Định",
      keywords: ["nam dinh"],
      fee: 55000,
      deliveryTime: "3–4 ngày",
    },

    {
      name: "Thái Bình",
      keywords: ["thai binh"],
      fee: 55000,
      deliveryTime: "3–4 ngày",
    },

    // ==============================
    // TRUNG DU & MIỀN NÚI PHÍA BẮC
    // ==============================

    {
      name: "Hà Giang",
      keywords: ["ha giang"],
      fee: 60000,
      deliveryTime: "4–5 ngày",
    },

    {
      name: "Cao Bằng",
      keywords: ["cao bang"],
      fee: 60000,
      deliveryTime: "4–5 ngày",
    },

    {
      name: "Bắc Kạn",
      keywords: ["bac kan", "bac can"],
      fee: 60000,
      deliveryTime: "4–5 ngày",
    },

    {
      name: "Tuyên Quang",
      keywords: ["tuyen quang"],
      fee: 60000,
      deliveryTime: "4–5 ngày",
    },

    {
      name: "Lào Cai",
      keywords: ["lao cai", "sapa", "sa pa"],
      fee: 60000,
      deliveryTime: "4–5 ngày",
    },

    {
      name: "Yên Bái",
      keywords: ["yen bai"],
      fee: 60000,
      deliveryTime: "4–5 ngày",
    },

    {
      name: "Thái Nguyên",
      keywords: ["thai nguyen"],
      fee: 60000,
      deliveryTime: "4–5 ngày",
    },

    {
      name: "Phú Thọ",
      keywords: ["phu tho", "viet tri"],
      fee: 60000,
      deliveryTime: "4–5 ngày",
    },

    {
      name: "Lạng Sơn",
      keywords: ["lang son"],
      fee: 60000,
      deliveryTime: "4–5 ngày",
    },

    {
      name: "Bắc Giang",
      keywords: ["bac giang"],
      fee: 60000,
      deliveryTime: "4–5 ngày",
    },

    {
      name: "Điện Biên",
      keywords: ["dien bien"],
      fee: 65000,
      deliveryTime: "4–6 ngày",
    },

    {
      name: "Lai Châu",
      keywords: ["lai chau"],
      fee: 65000,
      deliveryTime: "4–6 ngày",
    },

    {
      name: "Sơn La",
      keywords: ["son la"],
      fee: 65000,
      deliveryTime: "4–6 ngày",
    },

    // ==============================
    // CÁC KHU VỰC KHÁC
    // ==============================

    {
      name: "Các tỉnh khác",
      keywords: [],
      fee: 60000,
      deliveryTime: "3–5 ngày",
    },
  ],
};
