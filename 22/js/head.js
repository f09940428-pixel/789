// 1. 가상의 상품 데이터 (나중에 별도의 json 파일로 분리 가능)
const productData = {
    best: [
        { name: "실리프란 멀티 찜기 24cm", price: "45,000원", img: "https://via.placeholder.com/300" },
        { name: "저당 밥솥 실리콘 내솥", price: "29,000원", img: "https://via.placeholder.com/300" },
        { name: "프리미엄 조리도구 5종", price: "52,000원", img: "https://via.placeholder.com/300" },
        { name: "내열 유리 밀폐용기", price: "18,500원", img: "https://via.placeholder.com/300" }
    ],
    all: [
        { name: "실리콘 도마 세트", price: "34,000원", img: "https://via.placeholder.com/300" },
        { name: "친환경 수세미", price: "5,000원", img: "https://via.placeholder.com/300" },
        // ... 데이터 추가 가능
    ]
};

// 2. 상품 렌더링 함수
function renderProducts(targetId, products) {
    const container = document.getElementById(targetId);
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.img}" alt="${product.name}">
            <div class="product-info">
                <p class="product-name">${product.name}</p>
                <p class="product-price">${product.price}</p>
            </div>
        </div>
    `).join('');
}

// 3. 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('best-products', productData.best);
    renderProducts('all-products', productData.all);
    
    // 추가로 슬라이더나 배너 로직을 여기에 작성하세요.
});