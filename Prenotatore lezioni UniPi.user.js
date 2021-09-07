// ==UserScript==
// @name         Prenotatore lezioni UniPi
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prenota le lezioni in presenza dell'Università di Pisa
// @author       Alessandro Antonelli
// @match        https://agendadidattica.unipi.it/*
// @icon         https://www.google.com/s2/favicons?domain=unipi.it
// @grant        none
// ==/UserScript==
// Source code repository: https://github.com/alessandro-antonelli/prenotatore-lezioni-unipi

var OraAvvio;

(function()
{
	'use strict';

	OraAvvio = new Date();

	if(VerificaCaricamentoPagina() == -1) return;
	//InstallaNeutralizzatoreAlert();
	CaricaUI();
	//CaricaImpostazioni();
	//await VerificaCaricamentoAgenda();

	//await ElencaSlot();
	//CalcolaProssimoRiavvio();
	//await EseguiPrenotazioni();
})();

function VerificaCaricamentoPagina()
{
	const UrlAttuale = window.location.href;
	const UrlPrenotazioni = 'https://agendadidattica.unipi.it/Prod'

	if(UrlAttuale != UrlPrenotazioni) return -1;
	else return 0;
}

function CaricaUI()
{
	// Inietto CSS
	const CSS =
	`<style>
		
	</style>`;
	document.querySelector('head').innerHTML += CSS;

	// Inserisco casella dell'app
	const ContenutoRiquadroApp =
		`<h2>🤖Prenotatore lezioni UniPi</h2>
		Bla bla bla`;
	
		var RiquadroApp = document.createElement('div');
		RiquadroApp.id = 'RiquadroApp';
		RiquadroApp.style.padding = '8px';
		RiquadroApp.style.borderRadius = '20px';
		RiquadroApp.style.backgroundColor = '#DDDDDD';
		RiquadroApp.style.margin = '10px 5px';
	
		RiquadroApp.innerHTML = ContenutoRiquadroApp;
		document.querySelector("body > div.wrapper > div.content-wrapper").prepend(RiquadroApp);
}