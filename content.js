// content.js
let followers = [];
let following = [];
let analyzeButton; // 분석하기 버튼을 전역 변수로 선언
let loadingMessage; // 로딩 스피너 전역 변수

// 로딩 스피너 생성 함수
function createLoadingMessage(text) {
    loadingMessage = document.createElement('div');
    loadingMessage.style.position = 'fixed';
    loadingMessage.style.top = '50%';
    loadingMessage.style.left = '50%';
    loadingMessage.style.transform = 'translate(-50%, -50%)';
    loadingMessage.style.zIndex = '1002';
    loadingMessage.style.fontSize = '20px';
    loadingMessage.style.color = '#000'; // 스피너 색상
    loadingMessage.textContent = text; // 로딩 메시지
    loadingMessage.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // 배경색을 반투명하게 설정
    loadingMessage.style.padding = '10px'; // 패딩 추가
    loadingMessage.style.borderRadius = '5px'; // 모서리 둥글게
    document.body.appendChild(loadingMessage);
}

// 로딩 스피너 제거 함수
function removeLoadingMessage() {
    if (loadingMessage) {
        document.body.removeChild(loadingMessage);
        loadingMessage = null;
    }
}

// 팔로워 리스트를 가져오는 함수
async function getFollowers() {
    createLoadingMessage('팔로워 추출중...');
    followers = []; // 기존 리스트 초기화

    const parentXPath = '/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div';
    const parentElement = document.evaluate(parentXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (parentElement) {
        while (true) {
            const childDivs = parentElement.querySelectorAll('div'); // 모든 자식 div 선택

            const lastDiv = childDivs[childDivs.length - 1]; // 마지막 div 선택

            // 마지막 div에 포커스
            if (lastDiv) {
                lastDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
                await new Promise(resolve => setTimeout(resolve, 1500)); // 포커스 후 잠시 대기
            }

            // 더 이상 추가할 요소가 없으면 종료
            if (childDivs.length === parentElement.querySelectorAll('div').length) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // 포커스 후 잠시 대기
                if (childDivs.length === parentElement.querySelectorAll('div').length) {
                    break;
                }
            }
        }

        const childDivs = parentElement.querySelectorAll('div'); // 모든 자식 div 선택

        for (let i = 1; i < childDivs.length; i++) { // 0번째 제외하고 1번째부터 순회
            const followerXPath = `/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[${i}]/div[2]/div/div/div[1]/span/div/div/a/span/text()`;
            const followerElements = document.evaluate(followerXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            if (followerElements.snapshotLength > 0) {
                followers.push(followerElements.snapshotItem(0).textContent.trim());
            }
        }
    }

    console.log('Followers:', followers);
    removeLoadingMessage();
}

// 팔로잉 리스트를 가져오는 함수
async function getFollowing() {
    createLoadingMessage('팔로잉 추출중...');
    following = []; // 기존 리스트 초기화
    // 팔로잉 리스트를 보기 위해 해당 요소 클릭
    const clickElementXPath = '/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div/div/div[1]/div/div[2]/div';
    const clickElement = document.evaluate(clickElementXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (clickElement) {
        clickElement.click(); // 클릭 동작
        await new Promise(resolve => setTimeout(resolve, 1000)); // 클릭 후 잠시 대기
    }

    const parentXPath = '/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div';
    const parentElement = document.evaluate(parentXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (parentElement) {
        while (true) {
            const childDivs = parentElement.querySelectorAll('div'); // 모든 자식 div 선택
            const lastDiv = childDivs[childDivs.length - 1]; // 마지막 div 선택

            // 마지막 div에 포커스
            if (lastDiv) {
                lastDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
                await new Promise(resolve => setTimeout(resolve, 1500)); // 포커스 후 잠시 대기
            }

            // 더 이상 추가할 요소가 없으면 종료
            if (childDivs.length === parentElement.querySelectorAll('div').length) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // 포커스 후 잠시 대기
                if (childDivs.length === parentElement.querySelectorAll('div').length) {
                    break;
                }
            }
        }

        const childDivs = parentElement.querySelectorAll('div'); // 모든 자식 div 선택

        for (let i = 1; i < childDivs.length; i++) { // 0번째 제외하고 1번째부터 순회
            const followingXPath = `/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[${i}]/div[2]/div/div[1]/div[1]/span/div/div/a/span/text()`;
            const followingElements = document.evaluate(followingXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            if (followingElements.snapshotLength > 0) {
                following.push(followingElements.snapshotItem(0).textContent.trim());
            }
        }
    }

    console.log('Following:', following);
    removeLoadingMessage();
}

// 여집합을 구하는 함수
function getDifferences() {
    const followersSet = new Set(followers);
    const followingSet = new Set(following);

    const onlyInFollowing = [...followingSet].filter(follow => !followersSet.has(follow)); // 팔로잉에만 있는 계정

    return { onlyInFollowing };
}

// 결과를 팝업으로 보여주는 함수
function showResults() {
    const { onlyInFollowing } = getDifferences();
    if (onlyInFollowing.length == 0) {
        return;
    }
    createLoadingMessage('결과 반영중...');
    const parentXPath = '/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div';
    const parentElement = document.evaluate(parentXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const childDivs = parentElement.querySelectorAll('div'); // 모든 자식 div 선택

    for (let i = 1; i < childDivs.length; i++) { // 0번째 제외하고 1번째부터 순회
        const followingXPath = `/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[${i}]/div[2]/div/div[1]/div[1]/span/div/div/a/span/text()`;
        const followingElements = document.evaluate(followingXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (followingElements.snapshotLength > 0) {
            const accountName = followingElements.snapshotItem(0).textContent.trim();
            if (onlyInFollowing.find((name) => name === accountName)) {
                const parentDiv = followingElements.snapshotItem(0).parentElement; // 부모 요소 선택
                parentDiv.style.backgroundColor = 'red';
            }
        }
    }
    removeLoadingMessage();
}

// 분석하기 버튼 생성 함수
function createAnalyzeButton() {
    analyzeButton = document.createElement('button'); // 전역 변수로 버튼 생성
    analyzeButton.textContent = '분석하기';
    analyzeButton.style.position = 'fixed';
    analyzeButton.style.top = '130px'; // 아래로 위치 조정
    analyzeButton.style.right = '10px';
    analyzeButton.style.zIndex = '1000';
    analyzeButton.style.padding = '10px';
    analyzeButton.style.backgroundColor = '#dc3545'; // 다른 색상
    analyzeButton.style.color = '#fff';
    analyzeButton.style.border = 'none';
    analyzeButton.style.borderRadius = '5px';
    analyzeButton.style.cursor = 'pointer';

    analyzeButton.addEventListener('click', async () => {
        await getFollowers(); // 팔로워 리스트 가져오기
        await getFollowing(); // 팔로잉 리스트 가져오기
        showResults(); // 결과 팝업 보여주기
    });

    document.body.appendChild(analyzeButton); // 버튼을 페이지에 추가
}

// 특정 요소가 생겼을 때 버튼 추가
function observeForButton() {
    const targetXPath = '/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div';
    const observer = new MutationObserver(() => {
        const newTargetElement = document.evaluate(targetXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (newTargetElement) {
            if (!analyzeButton) {
                createAnalyzeButton(); // 버튼 추가
            }
        } else if (analyzeButton) {
            document.body.removeChild(analyzeButton); // 버튼 제거
            analyzeButton = null; // 버튼 변수 초기화
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// 페이지에 버튼 추가
observeForButton();
