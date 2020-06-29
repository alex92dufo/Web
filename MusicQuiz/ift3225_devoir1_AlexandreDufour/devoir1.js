//Alexandre Dufour, p1054564
$(document).ready( function() {

    // sélecteurs
    var $readyNormal = $('#readyNormal'),
	$readyAssisted = $('#readyAssisted'),
	$normal = $('#normal'),
	$assisted = $('#assisted'),
	$ready = $('#ready'),
	$choice1 = $('#choice1'),
	$choice2 = $('#choice2'),
	$choice3 = $('#choice3'),
	$timer = $('#timer'),
	$info = $('#info'),
	$score = $('#score'),
	$answer = $('#testAnswer'),
	$question = $('#testQuestion'),
	$submit = $('#submit'),
	$game= $('#jeu'),
	$lastScore = $('#lastScore'),
	$result = $('#result'),
	$toggleButton = $('#toggleButton'),
	$navbar = $('#navbar'),
	$navul = $('ul');

	var debut=true,timer,a,b,duree,gametime=20000, seconde = 1000, numberSection, peviousScore,
		question, time, click;

	$game.hide();

    //Il semblait y avoir un problème avec le toggle du bouton de menu
	//lorsque la fenêtre était trop petite. Le toggle ne s'activait pas.
	//J'ai donc écrit manuellement le code.
    $toggleButton.click(function(){
    	if($navbar.hasClass("collapse"))
    		$navbar.removeClass("collapse");
    	else
    		$navbar.addClass("collapse");
	});

    //Si le menu toggle est ouvert et qu'on clique sur un élément du menu, le menu
	//se refermera automatiquement.
	$navul.click(function(){
		if(!$navbar.hasClass("collapse"))
			$navbar.addClass("collapse");
	});

	//Déterminer le nombre de section de connaissance, servira pour déterminer
	//la question choisi.
	var numberSection = $(".section").length;

	 //function permettant de répartir les choix de réponses sur les boutons
	 function assistedButton(button1, button2, button3, sectionNo, questionNo, numberQuestion){
		 button1.text($(".section"+sectionNo+" .answer" + questionNo).text());

		 var questionNo2 = Math.floor(Math.random() * numberQuestion)+1;
		 while(questionNo2 == questionNo)
			 questionNo2 = Math.floor(Math.random() * numberQuestion)+1;
		 button2.text($(".section"+sectionNo+" .answer" + questionNo2).text());

		 var questionNo3 = Math.floor(Math.random() * numberQuestion)+1;
		 while(questionNo3 == questionNo || questionNo3 == questionNo2)
			 questionNo3 = Math.floor(Math.random() * numberQuestion)+1;
		 button3.text($(".section"+sectionNo+" .answer" + questionNo3).text());
	 }

	 //Fonction permettant de choisir une section de connaissance puis un question
	//associé à la section. Choix au hasard.
    function chooseQuestion(type){
		var sectionNo = Math.floor(Math.random() * numberSection)+1;
		//On détermine le nombre de question possible dans la section.
		var numberQuestion = $(".section" + sectionNo + " .question").length;
		var questionNo = Math.floor(Math.random() * numberQuestion)+1;

		//Selon la section déterminé, la forme de la question ne sera pas la même.
		if(sectionNo == 1){
			$src = $(".section" + sectionNo + ' .question' + questionNo).attr('src');
			$question.text("Quel est le chiffre et l'altération (tonalité) de la note suivante: ");
			$(new Image()).attr('src', '' + $src).attr('height', '45').appendTo($question).fadeIn();
		}
		if(sectionNo == 2){
			$question.text("Quel est le mode majeur de la tonalité suivante: " +  $(".section" + sectionNo + ' .question' + questionNo).text());
		}
		if(sectionNo == 3){
			$question.text("Quel est le mode mineur de la tonalité suivante: " +  $(".section" + sectionNo + ' .question' + questionNo).text());
		}
		if(sectionNo == 4){
			$question.text("Quelles sont les notes formant cet accord: " +  $(".section" + sectionNo + ' .question' + questionNo).text());
		}

		//Si on utilise le mode de jeu assisté, on affecte à un des trois boutons
		//la bonne réponse, et aux deux autres boutons on affecte aléatoirement
		//des réponses possibles. Il est important que chaque bouton propose
		//des réponses différentes.
		if(type == 'assisted'){
			//On détermine lequel des trois boutons aura la bonne réponse
			var buttonNo = Math.floor(Math.random() * 3)+1;
			if(buttonNo == 1){
				assistedButton($choice1, $choice2, $choice3, sectionNo, questionNo, numberQuestion);
			}
			if(buttonNo == 2){
				assistedButton($choice2, $choice1, $choice3, sectionNo, questionNo, numberQuestion);
			}
			if(buttonNo == 3){
				assistedButton($choice3, $choice1, $choice2, sectionNo, questionNo, numberQuestion);
			}
		}
		return [sectionNo, questionNo];
    }

    //Fonction permettant de mettre en place le timer de 15 secondes pour répondre
	//à la question.
    function setTime(){
		time = setTimeout(
			function() {

				// arreter les chronos
				clearTimeout(time);
				clearInterval(click);
				$lastScore.text(parseInt($score.text()));
				$result.text("Pas assez rapide!");
				$answer.val("");
				$game.hide();
				$ready.show();
			},
			duree=gametime);

		click = setInterval(
			function() {
				duree -= seconde;
				$timer.text(duree / 1000);
			},
			seconde);

    	return [time, click];
	}

	//Fonction permettant de mettre à jour la page en cas de bonne réponse en mode
	//assisté
	function updateGood(timeData, mode) {

		$result.text("Bonne réponse!");
		$answer.focus();
		clearTimeout(timeData[0]);
		clearInterval(timeData[1]);
		previousScore = parseInt($score.text());
		$score.text(previousScore + calculateScore(duree));
		question = chooseQuestion(mode);
		timeData = setTime();
		$answer.val("");
		$timer.text("20");

		return timeData;
	}

	//Fonction permettant de mettre à jour en cas de mauvaise réponse
	function updateBad(timeData){

		previousScore = 0;
		$result.text("Mauvaise Réponse, veuillez recommencer!");
		clearTimeout(timeData[0]);
		clearInterval(timeData[1]);
		$lastScore.text(parseInt($score.text()));
		$game.hide();
		$ready.show();
		$timer.text("");
	}


    //Fonction activé en cliquant sur le bouton prêt. Le jeu peut alors commencé.
	//Mode de jeu normal
    $readyNormal.click(function() {

    	//Mise en place. On montre à l'écran l'espace de jeu.
		$result.text("Bonne chance!");
		$game.show();
		$normal.show();
		$assisted.hide();
        $ready.hide();
        $score.text("0");
        $answer.focus();
        $answer.val("");
        $timer.text("20");

        //On choisi une question
		question = chooseQuestion('normal');

	// timer 
	   timeData = setTime();

	   //En cliquant sur le bouton soumettre, une série d'action est activée
		//dépendant qu'on ait la bonne réponse ou non
		$submit.click(function(){
			//Si on a la bonne réponse
			if ($(".section"+question[0]+" .answer" + question[1]).text() == $answer.val()){
				newTimeData = updateGood(timeData, 'normal');
				timeData = newTimeData;
			}
			//Si on n'a pas la bonne réponse
	       else{
				updateBad(timeData);
			}
	    });
    });

    //Mode de jeu assisté, avec trois choix de réponse
	$readyAssisted.click(function() {

		//Mise en place. On montre à l'écran l'espace de jeu.
		$result.text("Bonne chance!");
		$game.show();
		$assisted.show();
		$normal.hide();
		$ready.hide();
		$score.text("0");
		$timer.text("20");

		//On choisi une question
		question = chooseQuestion('assisted');

		// timer
		timeData = setTime();

		//En cliquant sur le bouton soumettre, une série d'action est activé
		//dépendant qu'on ait la bonne réponse ou non
		$choice1.click(function(){
			//Si on a la bonne réponse
			if ($(".section"+question[0]+" .answer" + question[1]).text() == $choice1.text()){
				newTimeData = updateGood(timeData, 'assisted');
				timeData = newTimeData;
			}
			//Si on n'a pas la bonne réponse
			else{
				updateBad(timeData);
			}
		});

		$choice2.click(function(){
			//Si on a la bonne réponse
			if ($(".section"+question[0]+" .answer" + question[1]).text() == $choice2.text()){
				newTimeData = updateGood(timeData, 'assisted');
				timeData = newTimeData;
			}
			//Si on n'a pas la bonne réponse
			else{
				updateBad(timeData);
			}
		});

		$choice3.click(function(){
			//Si on a la bonne réponse
			if ($(".section"+question[0]+" .answer" + question[1]).text() == $choice3.text()){
				newTimeData = updateGood(timeData, 'assisted');
				timeData = newTimeData;
			}
			//Si on n'a pas la bonne réponse
			else{
				updateBad(timeData);
			}
		});
	});

    //Fonction permettant de calculer le score selon le temps pris pour répondre
	//à la question.
    function calculateScore(duree){
        return (duree/1000) * 2;
    }

})