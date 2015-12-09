//==========================================================================================================================================
// ※ 변수 설정
//==========================================================================================================================================
//테마
var type = "추천";//점집 테마
if (document.getElementById("go").className == "mateka") {//마테카 점집 테마
	type = "고통";
} else if (document.getElementById("go").className == "test") {//테스트 점집 테마
	type = "시험";
}

//임시
var i, j;//임시 변수
var temp;//임시 변수

//전송용 인수
var ser = ""; //서버 선택한 거 저장
var cha = ""; //캐릭터 선택한 거 저장
var tar = ""; //추천항목 선택한 거 저장

var cla = 0; //내캐릭터 - 직업 설정
var name = "모험가";//내캐릭터 - 이름 설정
var imgURL = "";//내캐릭터 - 일러 설정

//오토 관련
var auto;	//"내 캐릭터 관련" 오토
var running = 0;

var npcArr = [];//이용가능 NPC 대상 저장
var monsterArr = [];//이용가는 몬스터 대상 저장

//일러스트 관련
var images = "./images/";
var imageArray = [];//이미지 선로딩용 배열
var imageUp = 0;//0 : 업로드 안됨 / 1 : 업로드 됨

//==========================================================================================================================================
// ※ 함수 설정
//==========================================================================================================================================

//"내 캐릭터 설정창" 열기
function openPopup() {
	//"실행" 문구 수정
	document.getElementById("go_submit").value = "설정창 닫기 ▲";
	//아직 "닫기"가 실행중인 경우
	if (running == 1) {
		running = 0;
		clearTimeout(auto);
		document.getElementById("mySetting").styleTop = -document.getElementById("mySetting").offsetHeight + "px";
	}
	//본격적 열기
	running = 1;
	if (document.getElementById("mySetting").style.display != "block") {
		document.getElementById("mySetting").style.display = "block";
		openPopup();
	} else if (document.getElementById("mySetting").offsetTop < 0) {
		auto = setTimeout(function() {
			document.getElementById("mySetting").style.top = (document.getElementById("mySetting").offsetTop + 10).toString() + "px";
			openPopup();
		},0);
	} else {
		clearTimeout(auto);
		running = 0;
	}
}

//"내 캐릭터 설정창" 닫기
function closePopup() {
	//"실행" 문구 수정
	if (document.getElementById("npcList").value == "내캐릭터") {
		document.getElementById("go_submit").value = "내 캐릭터 설정 ▼";
	} else {
		document.getElementById("go_submit").value = type + "받으러 가기";
	}
	//아직 "열기"가 실행중인 경우
	if (running == 1) {
		running = 0;
		clearTimeout(auto);
		document.getElementById("mySetting").styleTop = "0px";
	}
	//본격적 닫기
	running = 1;
	if (document.getElementById("mySetting").offsetTop > -document.getElementById("mySetting").offsetHeight) {
		auto = setTimeout(function() {
			document.getElementById("mySetting").style.top = (document.getElementById("mySetting").offsetTop - 10).toString() + "px";
			closePopup();
		},0);
	} else if (document.getElementById("mySetting").style.display != "none") {
		clearTimeout(auto);
		document.getElementById("mySetting").style.display = "none";
	} else {
		clearTimeout(auto);
		running = 0;
	}
}

//"내 캐릭터 설정창" 전직 리스트 클릭효과
function classChange() {
	//해당 이미지 업로드
	document.getElementById("myClassList").onchange = function() {
		if (imageUp == 0) {
			document.getElementById("myShow").src = images + "loading.png";
			document.getElementById("myShow").src = images + "a" + document.getElementById("myJobList").value + "_" + document.getElementById("myClassList").value + ".png";
		}
	}
}

//기타 : 'indexOf' 부여 (ie8)
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === elt) return from;
        }
        return -1;
    };
}
//==========================================================================================================================================
// ※ Onload 1 : 사전 / 각종 리스트 세팅, 캐릭터 랜덤 선택 준비
//==========================================================================================================================================
window.onload = function() {

		//사전 : 각종 리스트 세팅
	//준비 - 서버
	document.getElementById("server").innerHTML = "\
			<p>1. 서버를 선택하세요</p>\
			<p>\
			<select id='serverList'>\
				<option value='' selected disabled>서버 리스트</option>\
				<option value='' disabled>------------------------</option>\
				<option value='0'>카인</option>\
				<option value='1'>디레지에</option>\
				<option value='2'>시로코</option>\
				<option value='3'>프레이</option>\
				<option value='4'>카시야스</option>\
				<option value='5'>힐더</option>\
				<option value='6'>안톤</option>\
				<option value='7'>바칼</option>\
				<option value='9'>레이드</option>\
			</select>\
			</p>";
	//준비 - 캐릭터
	document.getElementById("character").innerHTML = "\
			<p>2. NPC 또는 몬스터를 선택하세요 <input id='character_random' type='button' value='랜덤' disabled='disabled'></p>\
			<p>\
				<select id='npcList' disabled='disabled'>\
					<option value='' selected disabled>NPC 리스트</option>\
					<option value='' disabled>------------------------</option>\
					<option value='' disabled>[세리아]</option>\
					<option value='세리아'>　세리아 키르민</option>\
					<option value='내캐릭터'>　*내 캐릭터</option>\
					<option value='' disabled>[실버크라운]</option>\
					<option value='비탈라'>　청색의 수호자 비탈라</option>\
					<option value='' disabled>[시궁창]</option>\
					<option value='샤일록'>　샤일록 고블린드</option>\
					<option value='슈시아'>　슈시아</option>\
					<option value='스카디'>　스카디 여왕</option>\
					<option value='패리스'>　시궁창 공주 패리스</option>\
					<option value='레니'>　하급기사 레니</option>\
					<option value='' disabled>[언더풋]</option>\
					<option value='' disabled>　┗ 망자의 협곡, 길드삼거리</option>\
					<option value='다프네'>　　다프네 마브로</option>\
					<option value='드레이퓨스'>　　사신 드레이퓨스</option>\
					<option value='시모나'>　　시모나</option>\
					<option value='' disabled>　┗ 광장, 마스터길드</option>\
					<option value='그란디스'>　　그란디스 그라시아</option>\
					<option value='단진'>　　단진</option>\
					<option value='미네트'>　　미네트</option>\
					<option value='샤란'>　　샤란</option>\
					<option value='칸나'>　　칸나</option>\
					<option value='키리'>　　키리 더 레이디</option>\
					<option value='' disabled>　┗ 킹스로드, 항구</option>\
					<option value='메이아'>　　메이아 여왕</option>\
					<option value='아니스'>　　아니스</option>\
					<option value='아이리스'>　　아이리스 포춘싱어</option>\
					<option value='클론터'>　　클론터</option>\
					<option value='하츠'>　　하츠 폰 크루거</option>\
					<option value='' disabled>　┗ 기타</option>\
					<option value='사영'>　　그림자 검사 사영</option>\
					<option value='' disabled>[베히모스]</option>\
					<option value='오필리아'>　오필리아 베이그란스</option>\
					<option value='이사도라'>　이사도라</option>\
					<option value='' disabled>[북의 쉼터]</option>\
					<option value='아간조'>　대검의 아간조</option>\
					<option value='미쉘'>　미쉘 모나헌</option>\
					<option value='민타이'>　민타이</option>\
					<option value='' disabled>[겐트]</option>\
					<option value='반'>　반 발슈테트</option>\
					<option value='레베카'>　안내인 레베카</option>\
					<option value='젤딘'>　젤딘 슈나이더</option>\
					<option value='메이윈'>　중사 메이윈</option>\
					<option value='에르제'>　황녀 에르제</option>\
					<option value='' disabled>[쇼난, 시간의 문]</option>\
					<option value='길잃은전사'>　길잃은 전사</option>\
					<option value='부상당한소녀'>　부상당한 소녀</option>\
					<option value='아스카'>　쇼난 아스카</option>\
					<option value='시란'>　시란</option>\
					<option value='준'>　준</option>\
					<option value='' disabled>[슬라우 공업단지]</option>\
					<option value='리아'>　리아 리히터</option>\
					<option value='마티어스'>　마티어스 네스만</option>\
					<option value='일리아'>　일리아</option>\
					<option value='니베르'>　중장 니베르</option>\
					<option value='' disabled>[쿠룬달]</option>\
					<option value='구룡'>　구룡</option>\
					<option value='백명'>　백명</option>\
					<option value='' disabled>[노블 스카이]</option>\
					<option value='나엔'>　나엔 시거</option>\
					<option value='잭터'>　잭터 이글아이</option>\
					<option value='' disabled>[젤바]</option>\
					<option value='다나'>　다나 도나텔</option>\
					<option value='메릴'>　메릴 파이어니어</option>\
					<option value='아젤리아'>　아젤리아 로트</option>\
					<option value='헌터폰'>　헌터 폰</option>\
					<option value='' disabled>[세인트 혼]</option>\
					<option value='나탈리아'>　나탈리아 수</option>\
					<option value='루드밀라'>　신궁 루드밀라</option>\
					<option value='루터'>　캡틴 루터</option>\
					<option value='' disabled>[절망의 탑]</option>\
					<option value='양얼'>　신검 양얼</option>\
					<option value='' disabled>[미러아라드]</option>\
					<option value='로리안'>　로리안</option>\
					<option value='감옥소녀'>　감옥 죄수 (여성)</option>\
					<option value='' disabled>[기타]</option>\
					<option value='데릴라'>　데릴라</option>\
					<option value='가브리엘'>　가브리엘</option>\
					<option value='간이정비기'>　간이정비기</option>\
				</select>\
				<select id='monsterList' disabled='disabled'>\
					<option value='' selected disabled>몬스터 리스트</option>\
					<option value='' disabled>------------------------</option>\
					<option value='' disabled>[전이된 아브노바]</option>\
					<option value='다크렉스'>　어둠을 흡수한 다크렉스</option>\
					<option value='' disabled>[해상열차]</option>\
					<option value='콩콩이'>　콩콩이</option>\
					<option value='페요'>　페요 피에르</option>\
					<option value='' disabled>[시간의 문]</option>\
					<option value='아스타로스'>　공포의 아스타로스</option>\
					<option value='흑막아이리스'>　아이리스(흑막)</option>\
					<option value='케인'>　케인</option>\
					<option value='바칼'>　폭룡왕 바칼</option>\
					<option value='' disabled>[파워스테이션]</option>\
					<option value='파트리스'>　전율의 파트리스</option>\
					<option value='퍼만'>　허무의 퍼만</option>\
					<option value='' disabled>[안톤]</option>\
					<option value='마테카'>　전능의 마테카</option>\
					<option value='' disabled>[죽은자의 성]</option>\
					<option value='베키'>　베키</option>\
					<option value='골드크라운'>　골드 크라운</option>\
					<option value='' disabled>[쿠룬산]</option>\
					<option value='드래곤스톤'>　드래곤 스톤</option>\
					<option value='' disabled>[이계]</option>\
					<option value='미카엘라'>　성안의 미카엘라</option>\
					<option value='오즈마와카시야스'>　오즈마 & 카시야스</option>\
					<option value='오즈마'>　혼돈의 오즈마</option>\
					<option value='' disabled>[고대던전]</option>\
					<option value='디레지에'>　검은 질병의 디레지에</option>\
					<option value='누빌루스'>　그림시커 사제 누빌루스</option>\
					<option value='란제루스'>　돌격대장 란제루스</option>\
					<option value='메카타우'>　하이퍼 메카타우</option>\
					<option value='' disabled>[마계]</option>\
					<option value='힐더'>　우는 눈의 힐더</option>\
					<option value='' disabled>[기타]</option>\
					<option value='병아리'>　병아리 더 치킨</option>\
				</select>\
			</p>";
	//준비 - 타겟 지정
	document.getElementById("go").innerHTML = "\
			<select id='go_target' disabled='disabled'>\
				<option value='0' selected>'채널' " + type+ "받기</option>\
				<option value='1'>'시간' " + type+ "받기</option>\
				<option value='2'>'지역' " + type+ "받기</option>\
				<option value='3'>'인물' " + type+ "받기</option>\
				<option value='4'>'(지옥파티)던전, 난이도' " + type+ "받기</option>\
			</select>\
			<p/>";
	//준비 - 내 캐릭터 설정창 (틀)
	document.getElementById("my_submit").value = type + "받으러 가기";
			
	//준비 - 내 캐릭터 설정창 (직업)
	document.getElementById("myJobList_p").innerHTML = "직　업 : \
		<select id='myJobList'>\
			<option value='' selected disabled>직업 리스트</option>\
			<option value='' disabled>------------------------</option>\
			<option value='1'>귀검사(남)</option>\
			<option value='2'>귀검사(여)</option>\
			<option value='3'>격투가(여)</option>\
			<option value='4'>격투가(남)</option>\
			<option value='5'>거너(남)</option>\
			<option value='6'>거너(여)</option>\
			<option value='7'>마법사(여)</option>\
			<option value='8'>마법사(남)</option>\
			<option value='9'>프리스트</option>\
			<option value='10'>도적</option>\
			<option value='11'>나이트</option>\
			<option value='12'>다크나이트</option>\
			<option value='13'>크리에이터</option>\
		</select>";
	//준비 - 내 캐릭터 설정창 (전직)
	function getClassList(num) {
		switch (parseInt(num)) {
			case 1:
				document.getElementById("myClassList_p").innerHTML = "전　직 : \
					<select id='myClassList'>\
						<option value='0' selected>귀검사(남) (기본 직업)</option>\
						<option value='1'>　웨펀마스터</option>\
						<option value='2'>　소울브링어</option>\
						<option value='3'>　버서커</option>\
						<option value='4'>　아수라</option>\
					</select>";
				break;
			case 2:
				document.getElementById("myClassList_p").innerHTML = "전　직 : \
					<select id='myClassList'>\
						<option value='0' selected>귀검사(여) (기본 직업)</option>\
						<option value='1'>　소드마스터</option>\
						<option value='2'>　데몬슬레이어</option>\
						<option value='3'>　베가본드</option>\
						<option value='4'>　다크템플러</option>\
					</select>";
				break;
			case 3:
				document.getElementById("myClassList_p").innerHTML = "전　직 : \
					<select id='myClassList'>\
						<option value='0' selected>격투가(여) (기본 직업)</option>\
						<option value='1'>　넨마스터(여)</option>\
						<option value='2'>　스트라이커(여)</option>\
						<option value='3'>　스트리트파이터(여)</option>\
						<option value='4'>　그래플러(여)</option>\
					</select>";
				break;
			case 4:
				document.getElementById("myClassList_p").innerHTML = "전　직 : \
					<select id='myClassList'>\
						<option value='0' selected>격투가(남) (기본 직업)</option>\
						<option value='1'>　넨마스터(남)</option>\
						<option value='2'>　스트라이커(남)</option>\
						<option value='3'>　스트리트파이터(남)</option>\
						<option value='4'>　그래플러(남)</option>\
					</select>";
				break;
			case 5:
				document.getElementById("myClassList_p").innerHTML = "전　직 : \
					<select id='myClassList'>\
						<option value='0' selected>거너(남) (기본 직업)</option>\
						<option value='1'>　레인저(남)</option>\
						<option value='2'>　런처(남)</option>\
						<option value='3'>　메카닉(남)</option>\
						<option value='4'>　스핏파이어(남)</option>\
					</select>";
				break;
			case 6:
				document.getElementById("myClassList_p").innerHTML = "전　직 : \
					<select id='myClassList'>\
						<option value='0' selected>거너(여) (기본 직업)</option>\
						<option value='1'>　레인저(여)</option>\
						<option value='2'>　런처(여)</option>\
						<option value='3'>　메카닉(여)</option>\
						<option value='4'>　스핏파이어(여)</option>\
					</select>";
				break;
			case 7:
				document.getElementById("myClassList_p").innerHTML = "전　직 : \
					<select id='myClassList'>\
						<option value='0' selected>마법사(여) (기본 직업)</option>\
						<option value='1'>　엘레멘탈마스터</option>\
						<option value='2'>　소환사</option>\
						<option value='3'>　마도학자</option>\
						<option value='4'>　배틀메이지</option>\
					</select>";
				break;
			case 8:
				document.getElementById("myClassList_p").innerHTML = "전　직 : \
					<select id='myClassList'>\
						<option value='0' selected>마법사(남) (기본 직업)</option>\
						<option value='1'>　엘레멘탈바머</option>\
						<option value='2'>　빙결사</option>\
					</select>";
				break;
			case 9:
				document.getElementById("myClassList_p").innerHTML = "전　직 : \
					<select id='myClassList'>\
						<option value='0' selected>프리스트 (기본 직업)</option>\
						<option value='1'>　크루세이더</option>\
						<option value='2'>　인파이터</option>\
						<option value='3'>　퇴마사</option>\
						<option value='4'>　어벤저</option>\
					</select>";
				break;
			case 10:
				document.getElementById("myClassList_p").innerHTML = "전　직 : \
					<select id='myClassList'>\
						<option value='0' selected>도적 (기본 직업)</option>\
						<option value='1'>　로그</option>\
						<option value='2'>　사령술사</option>\
						<option value='3'>　쿠노이치</option>\
						<option value='4'>　섀도우댄서</option>\
					</select>";
				break;
			case 11:
				document.getElementById("myClassList_p").innerHTML = "전　직 : \
					<select id='myClassList'>\
						<option value='0' selected>나이트 (기본 직업)</option>\
						<option value='1'>　엘븐나이트</option>\
						<option value='2'>　카오스</option>\
					</select>";
				break;
			case 12:
				document.getElementById("myClassList_p").innerHTML = "전　직 : \
					<select id='myClassList'>\
						<option value='0' selected>다크나이트</option>\
					</select>";
				break;
			case 13:
				document.getElementById("myClassList_p").innerHTML = "전　직 : \
					<select id='myClassList'>\
						<option value='0' selected>크리에이터</option>\
					</select>";
				break;
			//생성된 전직 리스트 활성화
		}
		//전직 리스트 클릭 효과
		classChange();
	}
	
	//준비 - 부가서비스
	document.getElementById("footer_left").innerHTML = "\
			★\
			<select id='etcList'>\
				<option value='' selected disabled>부가 서비스</option>\
				<option value='' disabled>------------------------</option>\
				<option value='황녀포춘'>황녀님의 포춘쿠키 (길흉점)</option>\
				<option value='소라고둥'>마법의 소라고둥 (YES or NO)</option>\
			</select>\
			<input id='footer_submit' type='button' value='접속하기' disabled='disabled'>";
	//준비 - 전용 서비스 (실행버튼)
	document.getElementById("go").innerHTML += "\
			<input id='go_submit' type='button' value='" + type + "받으러 가기' disabled='disabled'>";
	
	

	//사전 : 캐릭터 랜덤 선택 준비
	for (i=0;i<document.getElementById("npcList").length;i++) {
		if (document.getElementById("npcList").options[i].value != "") {
			npcArr.push(i);
		}
	}
	for (j=0;j<document.getElementById("monsterList").length;j++) {
		if (document.getElementById("monsterList").options[j].value != "") {
			monsterArr.push(j);
		}
	}
	document.getElementById("serverList").style.backgroundColor="";

	//사전 : 이미지 선로딩
		imageArray = [];
		//필수 이미지 선로딩
		imageArray.push(images + "empty.png");
		imageArray.push(images + "loading.png");
		//그외 직업별 이미지 선로딩
		for (i=0;i<13;i++)	{//직업 수 : 13
			for (j=-1;j<4;j++) {//전직 수 : 4
				imageArray.push(images + "a" + (i+1).toString() + "_" + (j+1).toString() + ".png");
			}
		}
		//이미지 선로딩 실시
		temp = imageArray.length;
		for (i=0;i<imageArray.length;i++) {
			var img = new Image();
			img.src = imageArray[i];
			document.getElementById('imagePreloader').innerHTML += "\
				<img src='" + img.src + "'>";
		};
//==========================================================================================================================================
// ※ Onload2 : 본격
//==========================================================================================================================================
	
	//본격 : 서버, 대상 선택
	document.getElementById("serverList").onchange = function() {//서버 선택 시
		//사전 : 팝업창 없애기
		closePopup();
		if (document.getElementById("serverList").value != "") {
			//서버 선택 표시 (전용 변수 입력 : 최종적으로 접속 시 입력됨)
			document.getElementById("serverList").style.backgroundColor="#F4FA58";
			//npc, 몬스터 선택 활성화 및 초기화
			document.getElementById("npcList").disabled = "";
			document.getElementById("npcList").style.backgroundColor="";
			document.getElementById("npcList").selectedIndex = 0;
			document.getElementById("monsterList").disabled = "";
			document.getElementById("monsterList").style.backgroundColor="";
			document.getElementById("monsterList").selectedIndex = 0;
			//캐릭터 랜덤 선택 버튼 활성화
			document.getElementById("character_random").style.color="black";
			document.getElementById("character_random").disabled = "";
			//추천대상 선택 활성화, "다음" 비활성화
			document.getElementById("go_target").style.color="gray";
			document.getElementById("go_target").style.backgroundColor="";
			document.getElementById("go_target").disabled = "disabled";
			document.getElementById("go_submit").style.color="gray";
			document.getElementById("go_submit").disabled = "disabled";
		}
	}
	
	document.getElementById("npcList").onchange = function() {//NPC 선택 시
		//사전 : 팝업창 없애기
		closePopup();
		if (document.getElementById("npcList").value != "") {
			//npc 선택 표시 (전용 변수 입력 : 최종적으로 접속 시 입력됨)
			document.getElementById("npcList").style.backgroundColor="#F4FA58";
			//몬스터 선택 초기화
			document.getElementById("monsterList").style.backgroundColor="";
			document.getElementById("monsterList").selectedIndex = 1;
			//추천대상 선택 활성화
			document.getElementById("go_target").style.color="black";
			document.getElementById("go_target").style.backgroundColor="#F4FA58";
			document.getElementById("go_target").disabled = "";
			//"다음" 활성화, 변경
			document.getElementById("go_submit").style.color="black";
			document.getElementById("go_submit").disabled = "";
			//"내 캐릭터" 선택 시 조치
			if (document.getElementById("npcList").value == "내캐릭터") {
				document.getElementById("go_submit").value = "내 캐릭터 설정 ▼";
			} else {
				document.getElementById("go_submit").value = type + "받으러 가기";
			}
		}
	}
	
	document.getElementById("monsterList").onchange = function() {//몬스터 선택 시
		//사전 : 팝업창 없애기
		closePopup();
		if (document.getElementById("monsterList").value != "") {
			//몬스터 선택 표시 (전용 변수 입력 : 최종적으로 접속 시 입력됨)
			document.getElementById("monsterList").style.backgroundColor="#F4FA58";
			//npc 선택 초기화
			document.getElementById("npcList").style.backgroundColor="";
			document.getElementById("npcList").selectedIndex = 1;
			//추천대상 선택 활성화, "다음" 활성화
			document.getElementById("go_target").style.color="black";
			document.getElementById("go_target").style.backgroundColor="#F4FA58";
			document.getElementById("go_target").disabled = "";
			//"다음" 활성화, 변경
			document.getElementById("go_submit").style.color="black";
			document.getElementById("go_submit").disabled = "";
			//"내 캐릭터" 선택 시 조치
			if (document.getElementById("npcList").value == "내캐릭터") {
				document.getElementById("go_submit").value = "내 캐릭터 설정";
			} else {
				document.getElementById("go_submit").value = type + "받으러 가기";
			}
		}
	}
	
	document.getElementById("character_random").onclick = function() {//랜덤 선택 시
		//사전 : 팝업창 없애기
		closePopup();
		
		temp = Math.floor(Math.random() * (npcArr.length + monsterArr.length));
		if (temp <= npcArr.length) { //랜덤이 NPC에 해당
			//npc 랜덤 선택 표시 (전용 변수 입력 : 최종적으로 접속 시 입력됨)
			document.getElementById("npcList").selectedIndex = npcArr[Math.floor(Math.random() * (npcArr.length))];
			document.getElementById("npcList").style.backgroundColor="#F4FA58";
			//몬스터 선택 초기화
			document.getElementById("monsterList").style.backgroundColor="";
			document.getElementById("monsterList").selectedIndex = 1;
		} else { //랜덤이 몬스터에 해당
			//몬스터 랜덤 선택 표시 (전용 변수 입력 : 최종적으로 접속 시 입력됨)
			document.getElementById("monsterList").selectedIndex = monsterArr[Math.floor(Math.random() * (monsterArr.length))];
			document.getElementById("monsterList").style.backgroundColor="#F4FA58";
			//npc 선택 초기화
			document.getElementById("npcList").style.backgroundColor="";
			document.getElementById("npcList").selectedIndex = 1;
		}
		//추천대상 선택 활성화, "다음" 활성화
		document.getElementById("go_target").style.color="black";
		document.getElementById("go_target").style.backgroundColor="#F4FA58";
		document.getElementById("go_target").disabled = "";
		//"다음" 활성화, 변경
		document.getElementById("go_submit").style.color="black";
		document.getElementById("go_submit").disabled = "";
		//"내 캐릭터" 선택 시 조치
		if (document.getElementById("npcList").value == "내캐릭터") {
			document.getElementById("go_submit").value = "내 캐릭터 설정 ▼";
		} else {
				document.getElementById("go_submit").value = type + "받으러 가기";
		}
	}

	document.getElementById("go_target").onchange = function() {//추천대상 선택 시
		if (document.getElementById("go_target").value != "") {
			//추천대상 선택한 거 표시 (전용 변수 입력 : 최종적으로 접속 시 입력됨)
			document.getElementById("go_target").style.backgroundColor="#F4FA58";
		}
	}
	
	document.getElementById("etcList").onchange = function() {//부가서비스 선택 시
		//사전 : 팝업창 없애기
		closePopup();
		if (document.getElementById("etcList").value != "") {
			//부가서비스 선택 표시 (전용 변수 입력 : 최종적으로 접속 시 입력됨)
			document.getElementById("etcList").style.backgroundColor="#F4FA58";
			//재접속 버튼 화성화
			document.getElementById("footer_submit").style.color="black";
			document.getElementById("footer_submit").disabled = "";
			document.getElementById("footer_submit").focus();
		}
	}
	
	document.getElementById("footer_submit").onclick = function() {//부가서비스 접속 선택 시
		//사전 : 팝업창 없애기
		closePopup();
		if (document.getElementById("etcList").value != "") {
			//전용 변수 입력
			ser = "0";
			tar = "0";
			cha = document.getElementById("etcList").value;
			//첫 화면 가리기
			document.getElementById("mainText").style.display = "none";
			//로컬스토리지에 "문자열 형태로" 변수 저장
			var inputObject = {
				autoGo : "",
				displayTime : "",
				speed : "",
				selectName : "",
				selectJob : "91",
				selectClass : "1",
				selectURL : "",
				selectServer : ser.toString(),
				selectTarget : tar.toString(),
				selectFile : "9101_" + cha
			};
			localStorage["dnf_Jum"] = JSON.stringify(inputObject);
			//점쟁이 화면 실행
			document.getElementById("mainContent").style.display = "block";
			document.getElementById("mainContent").src = "https://solarias.github.io/dnf_dialog/index.html";
		}
	}
	
	document.getElementById("go_submit").onclick = function() {//다음 진행시
		if (document.getElementById("npcList").value == "내캐릭터") {
			if (document.getElementById("mySetting").style.display != "block") {
				openPopup();
			} else {
				closePopup();
			}
		} else {
			//전용 변수 설정
			ser = document.getElementById("serverList").value;
			if (document.getElementById("npcList").value != "") {
				cha = document.getElementById("npcList").value; //npc 선택한 거 입력
			} else {
				cha = document.getElementById("monsterList").value; //몬스터 선택한 거 입력
			};
			tar = document.getElementById("go_target").value;
			//첫 화면 가리기
			document.getElementById("mainText").style.display = "none";
			//로컬스토리지에 "문자열 형태로" 변수 저장
			var inputObject = {
				autoGo : "",
				displayTime : "",
				speed : "",
				selectName : "",
				selectJob : "91",
				selectClass : "1",
				selectURL : "",
				selectServer : ser.toString(),
				selectTarget : tar.toString(),
				selectFile : "9101_" + cha
			};
			localStorage["dnf_Jum"] = JSON.stringify(inputObject);
			//점쟁이 화면 실행
			document.getElementById("mainContent").style.display = "block";
			document.getElementById("mainContent").src = "https://solarias.github.io/dnf_dialog/index.html";
		}
	}
	
	//내 캐릭터 - 직업 설정
		document.getElementById("myJobList").onchange = function() {
			//전직 리스트 생성
			getClassList(parseInt(document.getElementById("myJobList").value));
			//리스트에 색상 표시
			document.getElementById("myJobList").style.backgroundColor = "#F4FA58";
			document.getElementById("myClassList").style.backgroundColor = "#F4FA58";
			//해당 이미지 업로드
			if (imageUp == 0) {
				document.getElementById("myShow").src = images + "loading.png";
				document.getElementById("myShow").src = images + "a" + document.getElementById("myJobList").value + "_" + document.getElementById("myClassList").value + ".png";
			}
			//"시작" 버튼 활성화
			document.getElementById("my_submit").style.color="black";
			document.getElementById("my_submit").disabled = "";
		}
		
	//내 캐릭터 - 전직 설정
		
	//내 캐릭터 - 이름 설정
		
	//내 캐릭터 - 일러스트 설정
		//내 캐릭터 - 일러스트 설정 - 업로드
		document.getElementById("myImageUpload").onclick = function() {
			if (document.getElementById("myImage").value == "") {
				alert("(이미지 URL링크)가 입력되지 않았습니다.");
			} else {
				var img = new Image();
				img.onload = function() {
					imageUp = 1;
					document.getElementById("myShow").src = images + "loading.png";
					document.getElementById("myShow").src = document.getElementById("myImage").value;
				};
				img.onerror = function() {
					alert("해당 URL링크에서 이미지를 찾을 수 없습니다.");
				};
				img.src = document.getElementById("myImage").value;
			}
		}
		
		//내 캐릭터 - 일러스트 설정 - 초기화
		document.getElementById("myImageClear").onclick = function() {
			//이미지 입력란 삭제, 변수 변경
			document.getElementById("myImage").value = "";
			imageUp = 0;
			imgURL = "";//지난 번 추천을 위해 업로드해둔 URL도 삭제
			//이미지 변경
			if (document.getElementById("myJobList").value == "") {
				//직업 미선택 - 공란
				document.getElementById("myShow").src = images + "empty.png";
			} else {
				//직업 선택함 - 해당 직업/전직
				document.getElementById("myShow").src = images + "a" + document.getElementById("myJobList").value + "_" + document.getElementById("myClassList").value + ".png";
			}
		}
		
	//내 캐릭터 - 추천받으러 가기
		document.getElementById("my_submit").onclick = function() {//다음 진행시
			//이름 특수문자 체크
			var special = ['&'];
			//1. 이름이 없음
			if (document.getElementById("myText").value == "") {
				alert("(캐릭터의 이름)이 입력되지 않았습니다.");
				return;
			}
			//2. 이름이 너무 길다.
			if (document.getElementById("myText").value.length > 100) {
				alert("(캐릭터의 이름)이 100자가 넘습니다. 길이를 줄여주세요.");
				return;
			}
			//3. 이름에 제외대상 특문 있음
			for (i=0;i<special.length;i++) {
				if (document.getElementById("myText").value.indexOf(special[i]) >= 0) {
					alert("(캐릭터의 이름)에서 ' " + special[i] + " ' 문자는 사용하실 수 없습니다.");
					return;
				}
			}
			//Ex. 이미지 URL링크가 너무 길다
			if (document.getElementById("myImage").value.length > 1000) {
				alert("(이미지 URL링크)가 너무 깁니다. 1000자를 넘지 않게 해주세요.");
				return;
			}
			//설정창 닫기
			closePopup();
			//전용 변수 설정
			ser = document.getElementById("serverList").value;
			if (document.getElementById("npcList").value != "") {
				cha = document.getElementById("npcList").value; //npc 선택한 거 입력
			} else {
				cha = document.getElementById("monsterList").value; //몬스터 선택한 거 입력
			};
			tar = document.getElementById("go_target").value;
			cla = document.getElementById("myJobList").value + "_" + document.getElementById("myClassList").value;
			name = document.getElementById("myText").value;
			if (imageUp == 1) {
				imgURL = "";
				imgURL = document.getElementById("myShow").src;
			}
			//첫 화면 가리기
			document.getElementById("mainText").style.display = "none";
			//로컬스토리지에 "문자열 형태로" 변수 저장
			var inputObject = {
				autoGo : "",
				displayTime : "",
				speed : "",
				selectName : name.toString(),
				selectJob : "91",
				selectClass : cla.toString(),
				selectURL : imgURL.toString(),
				selectServer : ser.toString(),
				selectTarget : tar.toString(),
				selectFile : "9101_" + cha
			};
			localStorage["dnf_Jum"] = JSON.stringify(inputObject);
			//점쟁이 화면 실행
			document.getElementById("mainContent").style.display = "block";
			document.getElementById("mainContent").src = "https://solarias.github.io/dnf_dialog/index.html";
		}
		
		//내 캐릭터 - 취소
		document.getElementById("my_cancel").onclick = function() {
			closePopup();
		}
};