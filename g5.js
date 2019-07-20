$(document).ready(function () {
	var questionBank=new Array;
	var currentQuestionNumber;
	var currentAnswer;
	var numberOfQuestions;
	var totalQuestions;
	var gamePosition;
	var score;
	var counter;
	var pathImg='img';

	var sheet=7;//lv+1
	var jsonUrl = 'https://spreadsheets.google.com/feeds/cells/1NXcNvxxd3asfF0I5HeQzyulIAgpLCAdETsPlRN4zZ_M/'+sheet+'/public/full?alt=json';         
	$.getJSON(jsonUrl, function(data){
		var entry = data.feed.entry;
		var hints = [];
		var quests = [];
		var answers = [];
		var images = [];
		for (var i = 3; i < entry.length; i += 4){
		// entry[i].content.$t retrieves the content of each cell
		hints.push(entry[i].content.$t);
		quests.push(entry[i+1].content.$t);
		answers.push(entry[i+2].content.$t);
		images.push(entry[i+3].content.$t);
		}
		totalQuestions=quests.length;
		for(i=0;i<totalQuestions;i++){  
			typeArray=[];
			typeArray[0]=hints[i];			
			typeArray[1]=quests[i];
			typeArray[2]=answers[i];
			typeArray[3]=images[i];
			questionBank[i]=typeArray; 
		}
		numberOfQuestions=questionBank.length;
		gamePosition=1; 
		resetGame();
		updateQuestion();
		
	})//getJSON
	/*
	$(document).on("click tap",function(){
		gameControl();
	});//tap
	*/
	$(document).on("keyup",function(e){
		if(e.which==13){gameControl();};						  
	});
	$(document).on("click","#time",function(){
		gameControl();
	});
	$(document).on("click","#btnNext",function(){
		gameControl();
	});
	$(document).on("click","#btnStop",function(){
		scorePage();
	});
	$(document).on("click","#btnRestart",function(){
		location.reload(true);
	});

	function gameControl(){		
		switch (gamePosition) { 
			case 1: 
				checkAnswer();
				break;
			case 2: 
				updateQuestion();
				break;
			case 3: 
				scorePage();
				break;		
			case 4: 
				resetGame();
				updateQuestion();
				break;		
		}//switch	
	}//gamecontrol

	function resetGame(){
		counter = 66;
		score=0;
		currentQuestionNumber=Math.floor(Math.random()*numberOfQuestions);
		$('#gameArea').empty();
		$('#gameArea').append('<div id="control" class="fixed-bottom"></div>');
		$('#gameArea').append('<div id="message"></div>');
		$('#message').append('<button id="time" class="btn btn-outline-warning">66</button>');
		$('#message').append('<input type="text" id="inputBox">');
		$('#message').append('<input type="button" value="0" id="btnScore" class="btn btn-outline-info float-right">');
		$('#message').append('<h3 id="wordBox"></h3>');
		$('#control').append('<button id="btnNext" class="btn btn-outline-success float-right">NEXT</button>');
	};//resetGame
	function updateQuestion(){
		$('#wordBox').empty();
		$('#wordBox').append(questionBank[currentQuestionNumber][1]);
		$('#btnStop').remove();
		$('#inputBox').val('');
		$('#inputBox').prop('disabled',false);
		$('#inputBox').css('background','transparent');
		$('#inputBox').css('color','#f39');
		$('body').css('background-image', 'url("'+pathImg+'/'+questionBank[currentQuestionNumber][3]+'")');
		
		currentAnswer=questionBank[currentQuestionNumber][2];
		questionBank.splice(currentQuestionNumber, 1);
		numberOfQuestions=questionBank.length;
		//console.log(numberOfQuestions);
		currentQuestionNumber=Math.floor(Math.random()*numberOfQuestions);
		gamePosition=1;
		if(numberOfQuestions==0){scorePage();}
	}//updateQuestion
	function checkAnswer(){
		myAnswer=$('#inputBox').val();
		if(myAnswer.slice(myAnswer.length-1,myAnswer.length)==" "){
			myAnswer=myAnswer.slice(0,myAnswer.length-1);}
		if(currentAnswer==myAnswer){
			counter+=15;
			score++;
			$('#btnScore').val(score);
			$('#inputBox').css("background-color","green");
			$('#inputBox').css('color',"white");
		}
		else{
			$('#control').prepend('<input type="button" value="STOP" id="btnStop" class="btn btn-outline-danger">');
			$('#inputBox').css("background-color","red");
			$('#inputBox').css('color',"white");
			$('#inputBox').val("Đáp: "+currentAnswer);
		}
		$('#inputBox').prop('disabled', true);
		$('#btnScore').focus();
		gamePosition=2;
	}//checkAnswer				
	function scorePage(){
		$('#gameArea').empty();
		$('#gameArea').append('<div id="rightf" class="float-right"></div>');
		$('#gameArea').append('<input type="button" id="btnRestart" class="btn btn-outline-warning" value="RESTART">');
		$('#gameArea').append('<input type="button" id="btnShare" class="btn btn-primary" value="SHARE">');
		$('#gameArea').append('<div id="wordBox">Đúng: '+score+'/'+totalQuestions+'</div>');
		$('#rightf').append('<a class="btn btn-outline-info" href="lv1.html">LV.1</a>');
		$('#rightf').append('<a class="btn btn-outline-info" href="lv2.html">LV.2</a>');
		$('#rightf').append('<a class="btn btn-outline-info" href="lv3.html">LV.3</a>');
		$('#rightf').append('<a class="btn btn-outline-info" href="lv4.html">LV.4</a>');
		$('#rightf').append('<a class="btn btn-info" href="lv5.html">LV.5</a>');
		gamePosition=4;
		//clearTimeout(t);
		//var t=setTimeout(function(){location.reload(true);},5000);
	}//scorePage
	var interval = setInterval(function() {
		counter--;
		if (counter <= 0) {
			clearInterval(interval);
			scorePage();	
			return;
		}else{
			$('#time').text(counter);
		}
	}, 1000);
	
});//doc end
