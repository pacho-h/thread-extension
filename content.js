// content.js

// 전역 변수 선언
let followers = [];
let following = [];
let analyzeButton = null;
let loadingMessage = null;

// 상수 선언
const SPINNER_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '1002',
    fontSize: '20px',
    color: '#000',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '10px',
    borderRadius: '5px'
};

// 유틸리티 함수
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 로딩 스피너 생성 함수
 * @param {string} text - 로딩 메시지
 */
function createLoadingMessage(text) {
    if (loadingMessage) return;
    loadingMessage = document.createElement('div');
    Object.assign(loadingMessage.style, SPINNER_STYLES);
    loadingMessage.textContent = text;
    document.body.appendChild(loadingMessage);
}

/**
 * 로딩 스피너 제거 함수
 */
function removeLoadingMessage() {
    if (loadingMessage) {
        document.body.removeChild(loadingMessage);
        loadingMessage = null;
    }
}

/**
 * XPath를 사용하여 요소를 찾는 함수
 * @param {string} xPath - XPath 경로
 * @returns {Element|null} - 찾은 요소
 */
function getElementByXPath(xPath) {
    return document.evaluate(xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

/**
 * 팔로워 리스트를 가져오는 함수
 */
async function getFollowers() {
    createLoadingMessage('팔로워 추출중...');
    followers = [];
    const parentElement = getElementByXPath('/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div');
    if (!parentElement) return;

    while (true) {
        const childDivs = parentElement.querySelectorAll('div');
        const lastDiv = childDivs[childDivs.length - 1];
        if (lastDiv) {
            lastDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
            await sleep(1500);
        }

        if (childDivs.length === parentElement.querySelectorAll('div').length) {
            await sleep(2000);
            if (childDivs.length === parentElement.querySelectorAll('div').length) break;
        }
    }

    followers = Array.from(parentElement.querySelectorAll('div'))
        .slice(1)
        .map((_, i) => {
            const xPath = `/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[${i + 1}]/div[2]/div/div/div[1]/span/div/div/a/span/text()`;
            const element = document.evaluate(xPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            return element.snapshotLength > 0 ? element.snapshotItem(0).textContent.trim() : null;
        })
        .filter(Boolean);

    console.log('Followers:', followers);
    removeLoadingMessage();
}

/**
 * 팔로잉 리스트를 가져오는 함수
 */
async function getFollowing() {
    createLoadingMessage('팔로잉 추출중...');
    following = [];
    const clickElement = getElementByXPath('/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div/div/div[1]/div/div[2]/div');
    if (clickElement) clickElement.click();
    await sleep(1000);

    const parentElement = getElementByXPath('/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div');
    if (!parentElement) return;

    while (true) {
        const childDivs = parentElement.querySelectorAll('div');
        const lastDiv = childDivs[childDivs.length - 1];
        if (lastDiv) {
            lastDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
            await sleep(1500);
        }

        if (childDivs.length === parentElement.querySelectorAll('div').length) {
            await sleep(2000);
            if (childDivs.length === parentElement.querySelectorAll('div').length) break;
        }
    }

    following = Array.from(parentElement.querySelectorAll('div'))
        .slice(1)
        .map((_, i) => {
            const xPath = `/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[${i + 1}]/div[2]/div/div[1]/div[1]/span/div/div/a/span/text()`;
            const element = document.evaluate(xPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            return element.snapshotLength > 0 ? element.snapshotItem(0).textContent.trim() : null;
        })
        .filter(Boolean);

    console.log('Following:', following);
    removeLoadingMessage();
}

/**
 * 팔로워/팔로잉 여집합을 구하는 함수
 * @returns {object} - 여집합 결과
 */
function getDifferences() {
    const followersSet = new Set(followers);
    const followingSet = new Set(following);
    const onlyInFollowing = [...followingSet].filter(follow => !followersSet.has(follow));
    return { onlyInFollowing };
}

/**
 * 분석 결과를 화면에 표시하는 함수
 */
function showResults() {
    const { onlyInFollowing } = getDifferences();
    if (!onlyInFollowing.length) return;
    createLoadingMessage('결과 반영중...');

    const parentElement = getElementByXPath('/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div');
    const childDivs = parentElement.querySelectorAll('div');

    childDivs.forEach((_, i) => {
        const xPath = `/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[${i + 1}]/div[2]/div/div[1]/div[1]/span/div/div/a/span/text()`;
        const element = document.evaluate(xPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (element.snapshotLength > 0) {
            const accountName = element.snapshotItem(0).textContent.trim();
            if (onlyInFollowing.includes(accountName)) {
                element.snapshotItem(0).parentElement.style.backgroundColor = 'red';
            }
        }
    });

    removeLoadingMessage();
}

/**
 * 분석하기 버튼 생성 함수
 */
function createAnalyzeButton() {
    analyzeButton = document.createElement('button');
    Object.assign(analyzeButton.style, {
        position: 'fixed',
        top: '130px',
        right: '10px',
        zIndex: '1000',
        padding: '10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    });
    analyzeButton.textContent = '분석하기';
    analyzeButton.addEventListener('click', async () => {
        await getFollowers();
        await getFollowing();
        showResults();
    });
    document.body.appendChild(analyzeButton);
}

/**
 * 특정 요소가 생겼을 때 버튼을 추가하는 함수
 */
function observeForButton() {
    const observer = new MutationObserver(() => {
        const target = getElementByXPath('/html/body/div[2]/div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div');
        if (target && !analyzeButton) createAnalyzeButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// 버튼 추가
observeForButton();
