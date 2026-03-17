// 데이터를 불러와서 화면에 그리는 공통 함수
async function loadData(url, containerId, renderFunction) {
try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("데이터 로드 실패");
    const data = await response.json();
    const container = document.getElementById(containerId);
    if (container) {
    container.innerHTML = data.map((item) => renderFunction(item)).join("");
    }
} catch (error) {
    console.error(`${url} 로드 실패:`, error);
}
}

// [렌더링 1] 메인 슬라이드 배너
function renderBanner(item) {
return `
        <div class="slide-item" style="background-image: url('${item.main_img}');">
            <div class="content-wrapper">
                <div class="slide-text">
                </div>
            </div>
        </div>
    `;
}

// [렌더링 2] 일반 상품 카드 (베스트, 전체, 추천 공용)
function renderProduct(item) {
const price = item.discountedPrice || item.price;
return `
        <div class="product-card">
            <img src="${item.main_img}" alt="${item.productName}">
            <div class="product-info">
                <div class="product-name">${item.productName}</div>
                <div class="price-info">
                    ${item.discountRate ? `<span class="discount">${item.discountRate}%</span>` : ""}
                    <span class="price">${price.toLocaleString()}원</span>
                </div>
            </div>
        </div>
    `;
}

// [렌더링 3] 베스트 리뷰 상품
function renderBestReview(item) {
return `
        <div class="review-card">
            <div class="review-img-box"><img src="${item.main_img}"></div>
            <div class="review-content">
                <p class="review-text">"${item.reviewText}"</p>
                <div class="review-prod-name">${item.productName}</div>
                <div class="review-user">${item.reviewerId} | ${item.reviewDate}</div>
            </div>
        </div>
    `;
}

// [렌더링 4] 실제 구매 후기
function renderCustomerReview(item) {
return `
        <div class="customer-review-item">
            <img src="${item.main_img}" class="review-thumb">
            <div class="review-info">
                <div class="review-prod-title">${item.productName}</div>
                <div class="review-msg">${item.reviewText}</div>
                <div class="review-meta">${item.reviewerId} | ${item.reviewDate}</div>
            </div>
        </div>
    `;
}

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
  // 모든 데이터 로드 (경로는 index.html 기준)
loadData("json/main_banner.json", "hero-slider", renderBanner).then(
    startSlider,
);
loadData("json/best_products.json", "best-products", renderProduct);
loadData("json/all_products.json", "all-products", renderProduct);
loadData(
    "json/recommended_products.json",
    "recommended-products",
    renderProduct,
);
loadData(
    "json/best_review_products.json",
    "best-review-products",
    renderBestReview,
);
loadData(
    "json/customer_reviews.json",
    "customer-reviews",
    renderCustomerReview,
);

  // 브랜드 추천 배너 (ID: brand_recommendation으로 수정)
fetch("json/brand_recommendation.json")
    .then((res) => res.json())
    .then((data) => {
    const item = data[0];
    const container = document.getElementById("brand_recommendation");
    if (container) {
        container.innerHTML = `
                    <div class="brand-banner-wrapper">
                        <a href="#">
                            <img src="${item.main_img}" alt="${item.altText}" class="full-banner-img">
                            <div class="brand-overlay">
                            </div>
                        </a>
                    </div>
                `;
    }
    });
});

function startSlider() {
const slides = document.querySelectorAll(".slide-item");
if (slides.length === 0) return;
let current = 0;
slides[0].classList.add("active");
setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
}, 4000);
}

// 1. 상품 데이터 예시 (나중에 JSON 파일에서 불러오도록 확장 가능)
const products = [
    {
        id: "1",
        name: "실리프란 멀티쿠커 전자레인지 찜기",
        price: 24800,
        discount: "30%",
        originPrice: 35000,
        img: "img/product1.jpg"
    },
    {
        id: "2",
        name: "실리프란 실리콘 조리도구 세트",
        price: 15900,
        discount: "20%",
        originPrice: 19800,
        img: "img/product2.jpg"
    },
    // 추가 상품 데이터...
];

// 2. 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    renderBestProducts();
    // 필요에 따라 다른 렌더링 함수 호출 (all-products 등)
});

// 3. 상품 렌더링 함수
function renderBestProducts() {
    const container = document.getElementById('best-products');
    if (!container) return;

    container.innerHTML = ''; // 초기화

    products.forEach(product => {
        // 상품 아이템 요소 생성
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.style.cursor = 'pointer'; // 클릭 가능함을 표시

        // 상품 HTML 구조 (이미지 클릭 시 이동을 위해 감싸기 가능)
        productItem.innerHTML = `
            <div class="product-thumb">
                <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200'">
            </div>
            <div class="product-info">
                <p class="product-name">${product.name}</p>
                <div class="price-box">
                    <span class="discount">${product.discount}</span>
                    <span class="price">${product.price.toLocaleString()}원</span>
                </div>
            </div>
        `;

        // 핵심: 클릭 이벤트 추가
        productItem.addEventListener('click', () => {
            // 상세 페이지로 이동하며 ID를 파라미터로 전달
            window.location.href = `sub_product_detail.html?id=${product.id}`;
        });

        container.appendChild(productItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. URL에서 ID 파라미터 추출
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (productId) {
        loadProductDetail(productId);
    }
});

function loadProductDetail(id) {
    // 실제로는 여기서 서버나 JSON 데이터를 다시 뒤져서 상품 정보를 가져옵니다.
    console.log("로드된 상품 ID:", id);

    // 예시: 상품명 변경 (index.html에서 넘겨받은 ID에 따라 분기 처리 가능)
    const titleElement = document.getElementById('sub-product-name');
    if (titleElement) {
        titleElement.textContent = `상품 번호 ${id}의 상세 정보 페이지`;
    }
    
    // 이미지 및 가격 정보도 같은 방식으로 업데이트...
}