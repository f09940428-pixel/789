async function initSubPage() {
    try {
        // 1. 상품 및 배송 데이터 로드
        const prodRes = await fetch('json/sub_product_info.json');
        const prodData = await prodRes.json();
        const p = prodData[0];

        document.getElementById('sub-product-name').innerText = p.productName;
        document.getElementById('sub-discount').innerText = `${p.discountRate}%`;
        document.getElementById('sub-origin-price').innerText = `${p.originalPrice.toLocaleString()}원`;
        document.getElementById('sub-price').innerText = `${p.discountedPrice.toLocaleString()}원`;
        document.getElementById('max-point').innerText = `${p.points.maxPoints}원`;
        document.getElementById('arrival-date').innerText = p.shipping.arrivalDate;

        document.getElementById('sub-point-list').innerHTML = `
            <li><span>기본적립</span><em>${p.points.base}원</em></li>
            <li><span><i class="tag-purple">슈퍼</i> 슈퍼적립 3%</span><em>${p.points.super}원</em></li>
            <li><span class="link-txt">네이버 현대카드 Ed2 결제 시</span><em>${p.points.card}원</em></li>
        `;

        const mainImg = document.getElementById('main-display-img');
        mainImg.src = p.thumbnails[0];
        const thumbBox = document.getElementById('sub-thumb-list');
        thumbBox.innerHTML = p.thumbnails.map((src, i) => `
            <div class="thumb-item ${i===0?'active':''}"><img src="${src}"></div>
        `).join('');

        document.querySelectorAll('.thumb-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                mainImg.src = this.querySelector('img').src;
                document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // 2. 리뷰 데이터 로드
        const revRes = await fetch('json/sub_reviews.json');
        const revData = await revRes.json();
        document.getElementById('total-review-count').innerText = `(${revData.totalReviewCount})`;
        
        const reviewList = document.getElementById('sub-review-list');
        reviewList.innerHTML = revData.reviews.map(rev => `
            <div class="sub-review-item">
                <div class="review-text-content">
                    <div class="star-rating">${'★'.repeat(rev.rating)} ${rev.rating}</div>
                    <div style="font-size:12px; color:#888; margin-bottom:5px;">${rev.userId} · ${rev.date}</div>
                    <div style="font-size:12px; color:#bbb; margin-bottom:10px;">옵션: ${rev.option}</div>
                    <div class="review-msg">${rev.content}</div>
                </div>
                ${rev.reviewImage ? `<div class="review-img-thumb"><img src="${rev.reviewImage}"></div>` : ''}
            </div>
        `).join('');

        // 3. 라이브 배너 로드
        const liveRes = await fetch('json/sub_live_info.json');
        const liveData = await liveRes.json();
        const live = liveData[0];
        document.getElementById('sub-live-section').innerHTML = `
            <div class="live-banner-box">
                <span style="font-weight:700;">${live.liveDate} ${live.liveTime}</span>
                <span class="live-status-badge">${live.status}</span>
                <span style="font-size:15px;">${live.title}</span>
                <div class="live-thumb-circle"><img src="${live.liveThumb}" style="width:100%; height:100%; object-fit:cover;"></div>
            </div>
        `;

        // 4. 다른 구성 로드
        const otherRes = await fetch('json/sub_other_items.json');
        const otherData = await otherRes.json();
        const otherContainer = document.getElementById('other-items-list');
        otherContainer.innerHTML = otherData.map(item => `
            <div class="other-item-card">
                <img src="${item.imgUrl}" style="width:100%; aspect-ratio:1/1; object-fit:contain;">
                <div style="padding:10px;">
                    <p style="font-size:13px; color:#5d4037; height:38px; overflow:hidden;">${item.name}</p>
                    <strong>${item.discountedPrice.toLocaleString()}원</strong>
                </div>
            </div>
        `).join('');

        // 5. [추가] 탭 메뉴 로드 (경로 및 키 수정)
        const tabRes = await fetch('json/sub_product_tabs.json'); // 경로를 json/ 으로 변경
        const tabData = await tabRes.json();
        const tabList = document.getElementById('sub-tabs-list');
        const tabs = tabData.product_tabs; // 키 이름을 product_tabs로 변경

        tabList.innerHTML = tabs.map(tab => {
            const countHtml = tab.count ? `<span class="tab-count">${tab.count.toLocaleString()}</span>` : '';
            return `
                <li class="tab-item ${tab.is_active ? 'active' : ''}" data-id="${tab.id}">
                    ${tab.label} ${countHtml}
                </li>
            `;
        }).join('');

        // 탭 클릭 이벤트 추가
        document.querySelectorAll('.tab-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
                this.classList.add('active');
                
                const targetId = this.getAttribute('data-id');
                const targetSec = document.getElementById(targetId);
                if(targetSec) {
                    window.scrollTo({ top: targetSec.offsetTop - 60, behavior: 'smooth' });
                }
            });
        });

    } catch (e) { 
        console.error("Data Load Error:", e); 
    }
}

document.addEventListener("DOMContentLoaded", initSubPage);

// initSubPage 함수 마지막 부분에 추가하세요
async function loadDetailAssets() {
    try {
        const res = await fetch('json/sub_detail_assets.json');
        const data = await res.json();
        const container = document.getElementById('sub-detail-images-wrap');

        // JSON에 정의된 순서대로 이미지 태그 생성
        container.innerHTML = data.detail_images.map(item => `
            <img src="${item.src}" alt="${item.alt}" class="sub-detail-img">
        `).join('');

    } catch (e) {
        console.error("상세 이미지 로드 실패:", e);
    }
}

// 기존 initSubPage 실행 시 같이 실행되도록 호출 추가
// (기존 코드 마지막 줄 쯤에 넣으시면 됩니다)
loadDetailAssets();

