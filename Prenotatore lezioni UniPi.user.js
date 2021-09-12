// ==UserScript==
// @name         Prenotatore lezioni UniPi
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prenota le lezioni in presenza dell'Università di Pisa
// @author       Alessandro Antonelli
// @match        https://agendadidattica.unipi.it/*
// @match        https://teachingagenda.unipi.it/*
// @icon         https://www.google.com/s2/favicons?domain=unipi.it
// @grant        none
// ==/UserScript==
// Source code repository: https://github.com/alessandro-antonelli/prenotatore-lezioni-unipi

const versione = '0.1';

var OraAvvio;
var OraUltimoControllo;
var ElencoLezioni = [];
var TimestampProssimoRiavvio;
var TimerProssimoRiavvio;
var TimerTieniAggiornataDataRiavvio;
var TimerAggiornaCountdown;
var TimerLampeggioSpia;
var PrenotazioniInCorso = 0;

const SimboloInfo = '<img width="16" height="16" style="margin-right: 3px" alt="Info" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+CiAgPGNpcmNsZSBjeT0iMjQiIGN4PSIyNCIgcj0iMjMiIHN0cm9rZT0iIzAwMCIgZmlsbD0ibm9uZSIvPgogIDxjaXJjbGUgY3g9IjI0IiBjeT0iMTEuNiIgcj0iNC43Ii8+CiAgPHBhdGggZD0ibTE3LjQgMTguOHYyLjE1aDEuMTNjMi4yNiAwIDIuMjYgMS4zOCAyLjI2IDEuMzh2MTUuMXMwIDEuMzgtMi4yNiAxLjM4aC0xLjEzdjIuMDhoMTQuMnYtMi4wOGgtMS4xM2MtMi4yNiAwLTIuMjYtMS4zOC0yLjI2LTEuMzh2LTE4LjYiLz4KPC9zdmc+" />';
const ThrobberCaricamento = '<img alt="caricamento..." style="object-fit: cover; height: 25px; width: 32px" height="32" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0ibWFyZ2luOiBhdXRvOyBiYWNrZ3JvdW5kOiBub25lOyBkaXNwbGF5OiBibG9jazsgc2hhcGUtcmVuZGVyaW5nOiBhdXRvOyIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4MCw1MCkiPgo8ZyB0cmFuc2Zvcm09InJvdGF0ZSgwKSI+CjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI2IiBmaWxsPSIjMzc4OGQ4IiBmaWxsLW9wYWNpdHk9IjEiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGJlZ2luPSItMC44NzVzIiB2YWx1ZXM9IjEuNiAxLjY7MSAxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZhbHVlcz0iMTswIiBiZWdpbj0iLTAuODc1cyI+PC9hbmltYXRlPgo8L2NpcmNsZT4KPC9nPgo8L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzEuMjEzMjAzNDM1NTk2NDMsNzEuMjEzMjAzNDM1NTk2NDMpIj4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoNDUpIj4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjYiIGZpbGw9IiMzNzg4ZDgiIGZpbGwtb3BhY2l0eT0iMC44NzUiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGJlZ2luPSItMC43NXMiIHZhbHVlcz0iMS42IDEuNjsxIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOzAiIGJlZ2luPSItMC43NXMiPjwvYW5pbWF0ZT4KPC9jaXJjbGU+CjwvZz4KPC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUwLDgwKSI+CjxnIHRyYW5zZm9ybT0icm90YXRlKDkwKSI+CjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI2IiBmaWxsPSIjMzc4OGQ4IiBmaWxsLW9wYWNpdHk9IjAuNzUiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGJlZ2luPSItMC42MjVzIiB2YWx1ZXM9IjEuNiAxLjY7MSAxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZhbHVlcz0iMTswIiBiZWdpbj0iLTAuNjI1cyI+PC9hbmltYXRlPgo8L2NpcmNsZT4KPC9nPgo8L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjguNzg2Nzk2NTY0NDAzNTc3LDcxLjIxMzIwMzQzNTU5NjQzKSI+CjxnIHRyYW5zZm9ybT0icm90YXRlKDEzNSkiPgo8Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iNiIgZmlsbD0iIzM3ODhkOCIgZmlsbC1vcGFjaXR5PSIwLjYyNSI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjVzIiB2YWx1ZXM9IjEuNiAxLjY7MSAxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZhbHVlcz0iMTswIiBiZWdpbj0iLTAuNXMiPjwvYW5pbWF0ZT4KPC9jaXJjbGU+CjwvZz4KPC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwLDUwLjAwMDAwMDAwMDAwMDAxKSI+CjxnIHRyYW5zZm9ybT0icm90YXRlKDE4MCkiPgo8Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iNiIgZmlsbD0iIzM3ODhkOCIgZmlsbC1vcGFjaXR5PSIwLjUiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGJlZ2luPSItMC4zNzVzIiB2YWx1ZXM9IjEuNiAxLjY7MSAxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZhbHVlcz0iMTswIiBiZWdpbj0iLTAuMzc1cyI+PC9hbmltYXRlPgo8L2NpcmNsZT4KPC9nPgo8L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjguNzg2Nzk2NTY0NDAzNTcsMjguNzg2Nzk2NTY0NDAzNTc3KSI+CjxnIHRyYW5zZm9ybT0icm90YXRlKDIyNSkiPgo8Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iNiIgZmlsbD0iIzM3ODhkOCIgZmlsbC1vcGFjaXR5PSIwLjM3NSI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjI1cyIgdmFsdWVzPSIxLjYgMS42OzEgMSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiB2YWx1ZXM9IjE7MCIgYmVnaW49Ii0wLjI1cyI+PC9hbmltYXRlPgo8L2NpcmNsZT4KPC9nPgo8L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDkuOTk5OTk5OTk5OTk5OTksMjApIj4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoMjcwKSI+CjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI2IiBmaWxsPSIjMzc4OGQ4IiBmaWxsLW9wYWNpdHk9IjAuMjUiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGJlZ2luPSItMC4xMjVzIiB2YWx1ZXM9IjEuNiAxLjY7MSAxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZhbHVlcz0iMTswIiBiZWdpbj0iLTAuMTI1cyI+PC9hbmltYXRlPgo8L2NpcmNsZT4KPC9nPgo8L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzEuMjEzMjAzNDM1NTk2NDMsMjguNzg2Nzk2NTY0NDAzNTcpIj4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoMzE1KSI+CjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI2IiBmaWxsPSIjMzc4OGQ4IiBmaWxsLW9wYWNpdHk9IjAuMTI1Ij4KICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InNjYWxlIiBiZWdpbj0iMHMiIHZhbHVlcz0iMS42IDEuNjsxIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOzAiIGJlZ2luPSIwcyI+PC9hbmltYXRlPgo8L2NpcmNsZT4KPC9nPgo8L2c+CjwhLS0gW2xkaW9dIGdlbmVyYXRlZCBieSBodHRwczovL2xvYWRpbmcuaW8vIC0tPjwvc3ZnPg==" />';

const SuonoNuovaLezionePubblicata = 'data:audio/mpeg;base64,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';
//fonte: https://notificationsounds.com/wake-up-tones/arpeggio-467

(async function()
{
	'use strict';

	OraAvvio = new Date();

	if(VerificaCaricamentoPagina() == -1) return;
	//InstallaNeutralizzatoreAlert();
	CaricaUI();
	CaricaImpostazioni();
	//await VerificaCaricamentoAgenda();

	await ElencaLezioni();
	CalcolaProssimoRiavvio();
	//await EseguiPrenotazioni();
})();

function VerificaCaricamentoPagina()
{
	const UrlAttuale = window.location.href;
	const UrlBaseIT = 'https://agendadidattica.unipi.it/';
	const UrlBaseEN = 'https://teachingagenda.unipi.it/';
	const UrlPrenotazioni = 'Prod/Home/Calendar';
	
	if(	UrlAttuale != (UrlBaseIT + UrlPrenotazioni) &&
		UrlAttuale != (UrlBaseEN + UrlPrenotazioni)) return -1;
	else return 0;
}

function CaricaUI()
{
	// Inietto CSS
	const CSS =
	`<style>
		.slider:hover { cursor: pointer; }
		.slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 25px; height: 25px; background: grey; cursor: pointer; border-radius: 12px; }
		label { font-weight: normal !important; cursor: pointer; }
		input[type=checkbox] { cursor: pointer; zoom: 2; }
		input[type=checkbox]:disabled { cursor: not-allowed; }

		.MioTooltip { position: relative; display: inline-block; }
		.MioTooltip .TestoTooltip { top: 120%; left: 50%; max-width: 350px; margin-left: -50%; visibility: hidden; background-color: black; color: #fff; text-align: center; padding: 5px 0; border-radius: 6px; position: absolute; z-index: 50; }
		.MioTooltip:hover .TestoTooltip { visibility: visible; }
		.MioTooltip .TestoTooltip::after { content: " "; position: absolute; bottom: 100%; left: 50%; margin-left: -8px; border-width: 8px; border-style: solid; border-color: transparent transparent black transparent; }
	</style>`;
	document.querySelector('head').innerHTML += CSS;

	// Inserisco casella dell'app
	const ContenutoRiquadroApp =
		`<h2>🤖Prenotatore lezioni UniPi</h2>

		<div style="width: 100%; float: left; font-size: 120%; padding: 0;">
			<div id="OFF" style="display: none; margin: 0 0 8px 0; text-align: center">
				<span style="background-color: #444444; color: white; font-size: 130%; font-weight: bold; border-radius: 8px; padding: 5px;">💤SPENTO</span>
				<!--<span style="font-style: italic; font-size: 80%; vertical-align: top; display: inline-block">` + SimboloInfo + `Seleziona uno slot<br/>dalla lista per avviarmi.</span>-->
			</div>
			<div id="ON" style="display: none; margin: 0 0 8px 0; text-align: center">
				<div style="text-align: center">
					<span id="SpiaON" style="transition-duration: 3s; background-color: firebrick; color: white; font-size: 130%; font-weight: bold; border-radius: 8px; padding: 5px; margin-right: 5px;">
					⚡ATTIVO</span><span style="font-style: italic; font-size: 80%; vertical-align: top; display: inline-block; max-width: 60%">` +
					SimboloInfo + `Non chiudere questa pagina; mantieni il computer acceso e connesso a internet!</span>
				</div>
			</div>

			<div style="border: 1px solid silver; margin-bottom: 8px; padding: 3px; border-left: none; border-right: none;">
				<span style="margin-right: 5px;">Stato</span><span id="attività" style="color: #6C6F71"></span>
			</div>
			<h3 style="color: #0F4A7C; font-weight: bold;">Impostazioni</h3>

			<fieldset id="FormFrequenza" style="padding: 0 0 0 0">
				<span style="vertical-align: top;">Frequenza dei controlli:</span>
				<div style="display: inline-block">
					<input id="FrequenzaSlider" class="slider" type="range" min="-3" max="3" value="0" style="display: inline-block; width: 180px; -webkit-appearance: none; background: #005CC8; height: 15px; border-radius: 7px;" />
					<div id="FrequenzaLabel" style="text-align: center; width: 180px; font-weight: bold; color: #005CC8;">ogni 3 minuti</div>
				</div>
			</fieldset>

			<label class="MioTooltip">
				<input type="checkbox" id="PrenotaNuoveLezioni" style="vertical-align: top" />
				Prenota le nuove lezioni senza chiedermelo
				<span class="TestoTooltip">Se selezioni questa opzione, quando viene pubblicata una nuova lezione nell'agenda, il prenotatore cercherà
				di prenotarla senza attendere un tuo ordine.<br/>➡️La pagina sarà aggiornata periodicamente per verificare se
				vengono pubblicate nuove lezioni.</span>
			</label>

			<h3 style="color: #0F4A7C; font-weight: bold;">Lezioni disponibili</h3>
			<div style="font-size: 80%; font-style: italic;">` + SimboloInfo +
				`Seleziona le lezioni che vuoi siano prenotate automaticamente.</div>

			<div id="ElencoLezioni" style="border: 1px solid silver; min-height: 150px; background-color: white;">
				<div style="text-align: center; font-size: 120%; padding: 8px;">
					<img alt="attendi..." width="64" height="64" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4wICg0MDM1YTRmYjQ5LCAyMDIwLTA1LTAxKSIKICAgc29kaXBvZGk6ZG9jbmFtZT0iR2Vhci5zdmciCiAgIGlkPSJzdmc4IgogICB2ZXJzaW9uPSIxLjEiCiAgIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIgogICB2aWV3Qm94PSIwIDAgOTAuMzQzODExIDkwLjM0MzgxMSIKICAgaGVpZ2h0PSIxODAuNjg3NjIiCiAgIHdpZHRoPSIxODAuNjg3NjIiCiAgIHN0eWxlPSJkaXNwbGF5OmJsb2NrO3NoYXBlLXJlbmRlcmluZzphdXRvIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGExNCI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczEyIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmc4IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii05IgogICAgIGlua3NjYXBlOndpbmRvdy14PSItOSIKICAgICBpbmtzY2FwZTpjeT0iODIuMjEzMjg4IgogICAgIGlua3NjYXBlOmN4PSIyNS4xNzM2NzQiCiAgICAgaW5rc2NhcGU6em9vbT0iMi45OTgxMzI4IgogICAgIGZpdC1tYXJnaW4tYm90dG9tPSI4IgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjgiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSI4IgogICAgIGZpdC1tYXJnaW4tdG9wPSI4IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpZD0ibmFtZWR2aWV3MTAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAwMSIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIgLz4KICA8ZwogICAgIGlkPSJnNiIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NS4xNzE5MDQsNDUuMTcxOTA0KSI+CiAgICA8ZwogICAgICAgaWQ9Imc0Ij4KICAgICAgPGFuaW1hdGVUcmFuc2Zvcm0KICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiCiAgICAgICAgIGR1cj0iMC40cyIKICAgICAgICAga2V5VGltZXM9IjA7MSIKICAgICAgICAgdmFsdWVzPSIwOzQ1IgogICAgICAgICB0eXBlPSJyb3RhdGUiCiAgICAgICAgIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgLz4KICAgICAgPHBhdGgKICAgICAgICAgaWQ9InBhdGgyIgogICAgICAgICBmaWxsPSIjNzY4MjhlIgogICAgICAgICBkPSJtIDI5LjE3MTkwNCwtNyBoIDEyIFYgNyBoIC0xMiBhIDMwLDMwIDAgMCAxIC0zLjU5NDUwNSw4LjY3NzkwNCB2IDAgbCA4LjQ4NTI4MSw4LjQ4NTI4MSAtOS44OTk0OTUsOS44OTk0OTUgLTguNDg1MjgxLC04LjQ4NTI4MSBBIDMwLDMwIDAgMCAxIDcsMjkuMTcxOTA0IHYgMCAxMiBIIC03IHYgLTEyIGEgMzAsMzAgMCAwIDEgLTguNjc3OTA0LC0zLjU5NDUwNSB2IDAgbCAtOC40ODUyODEsOC40ODUyODEgLTkuODk5NDk1LC05Ljg5OTQ5NSA4LjQ4NTI4MSwtOC40ODUyODEgQSAzMCwzMCAwIDAgMSAtMjkuMTcxOTA0LDcgdiAwIGggLTEyIFYgLTcgaCAxMiBhIDMwLDMwIDAgMCAxIDMuNTk0NTA1LC04LjY3NzkwNCB2IDAgbCAtOC40ODUyODEsLTguNDg1MjgxIDkuODk5NDk1LC05Ljg5OTQ5NSA4LjQ4NTI4MSw4LjQ4NTI4MSBBIDMwLDMwIDAgMCAxIC03LC0yOS4xNzE5MDQgdiAwIC0xMiBIIDcgdiAxMiBhIDMwLDMwIDAgMCAxIDguNjc3OTA0LDMuNTk0NTA1IHYgMCBsIDguNDg1MjgxLC04LjQ4NTI4MSA5Ljg5OTQ5NSw5Ljg5OTQ5NSAtOC40ODUyODEsOC40ODUyODEgQSAzMCwzMCAwIDAgMSAyOS4xNzE5MDQsLTcgTSAwLC0xOCBhIDE4LDE4IDAgMSAwIDAsMzYgMTgsMTggMCAxIDAgMCwtMzYiIC8+CiAgICA8L2c+CiAgPC9nPgogIDwhLS0gW2xkaW9dIGdlbmVyYXRlZCBieSBodHRwczovL2xvYWRpbmcuaW8vIC0tPgo8L3N2Zz4K" />
					<br/>Caricamento in corso...
				</div>
			</div>

			<div style="opacity: 0.7; text-align: center; margin-bottom: 5px">
				Questo è uno strumento <u>non</u> ufficiale: non è stato creato dall'Università di Pisa. <b>Usalo responsabilmente!</b>
			</div>
			<div style="font-size: 70%; opacity: 0.7; text-align: center">
				versione ` + versione + ` |
				©2021 <a href="https://alessandro-antonelli.github.io/" target="blank">Alessandro Antonelli</a> |
				<a href="https://github.com/alessandro-antonelli/prenotatore-lezioni-unipi" target="blank">codice sorgente su Github</a> |
				rilasciato con <a href="https://raw.githubusercontent.com/alessandro-antonelli/prenotatore-lezioni-unipi/main/LICENSE" target="blank">licenza MIT</a> |
				suoni: <a href="https://notificationsounds.com/" target="blank">Notification Sounds</a> |
				icone di caricamento: <a href="https://loading.io/" target="blank">Loading.io</a>
			</div>
		</div>
		`;

	var ContainerPagina = document.querySelector("body > div.wrapper > div.content-wrapper");
	var BoxAgenda = document.createElement('div');
	ContainerPagina.append(BoxAgenda);
	var TitoloAgenda = document.querySelector("body > div.wrapper > div.content-wrapper > section.content-header");
	var Agenda = document.querySelector("body > div.wrapper > div.content-wrapper > section.content");
	BoxAgenda.append(TitoloAgenda);
	BoxAgenda.append(Agenda);
	
	var BoxPrenotatore = document.createElement('div');
	BoxPrenotatore.id = 'BoxPrenotatore';
	BoxPrenotatore.style.minWidth = '220px';
	BoxPrenotatore.style.maxWidth = 'fit-content';
	BoxPrenotatore.style.height = 'fit-content';
	BoxPrenotatore.style.flex = '2 1 35vw';
	BoxPrenotatore.style.padding = '8px';
	BoxPrenotatore.style.borderRadius = '20px';
	BoxPrenotatore.style.backgroundColor = '#DDDDDD';
	BoxPrenotatore.style.margin = '10px 5px';
	
	BoxPrenotatore.innerHTML = ContenutoRiquadroApp;
	ContainerPagina.prepend(BoxPrenotatore);

	document.getElementById('PrenotaNuoveLezioni').addEventListener('click', ClickPrenotaNuoveLezioni);
	document.getElementById('FrequenzaSlider').addEventListener('input', CambiamentoFrequenza.bind(null, null));

	BoxAgenda.style.minWidth = '500px';
	BoxAgenda.style.flex = '1 1 60vw';
	BoxAgenda.style.marginLeft = 'unset';
	BoxAgenda.style.marginLeft = 'unset';
	
	ContainerPagina.style.display = 'flex';
	ContainerPagina.style.flexDirection = 'row';
	ContainerPagina.style.flexWrap = 'wrap';

	var ContenitoreAlert = document.createElement('div');
	ContenitoreAlert.id = 'ContenitoreAlert';
	ContenitoreAlert.style.position = 'fixed';
	ContenitoreAlert.style.top = '0';
	ContenitoreAlert.style.left = '0';
	ContenitoreAlert.style.width = '100%';
	ContenitoreAlert.style.fontSize = '130%';
	ContenitoreAlert.style.textAlign = 'center';
	ContenitoreAlert.style.zIndex = '10';
	document.body.append(ContenitoreAlert);
}

function CaricaImpostazioni()
{
	const ElencoLezioniStr = localStorage.getItem('ElencoLezioni');
	if(ElencoLezioniStr != null && ElencoLezioniStr != '') ElencoLezioni = JSON.parse(ElencoLezioniStr);

	const FrequenzaStr = localStorage.getItem('frequenza');
	if(FrequenzaStr != null) CambiamentoFrequenza(Number(FrequenzaStr));

	document.getElementById('PrenotaNuoveLezioni').checked = (localStorage.getItem('PrenotaNuoveLezioni') == 'true');
}

async function ElencaLezioni()
{
	var BottoneLista = document.querySelector("#calendar > div.fc-header-toolbar.fc-toolbar.fc-toolbar-ltr > div:nth-child(3) > div > button.fc-listWeek-button.fc-button.fc-button-primary.fc-button-active");
	await BottoneLista.click();
	var BottoneAvanti = document.querySelector("#calendar > div.fc-header-toolbar.fc-toolbar.fc-toolbar-ltr > div:nth-child(1) > div > button.fc-next-button.fc-button.fc-button-primary");
	var BottoneOggi = document.querySelector("#calendar > div.fc-header-toolbar.fc-toolbar.fc-toolbar-ltr > div:nth-child(1) > button");
	await BottoneOggi.click();

	const rosso = 'rgb(220, 53, 69)';
	//const giallo = '';
	const verde = 'rgb(40, 167, 69)';

	const PrenotareDefault = (localStorage.getItem('PrenotaNuoveLezioni') == 'true');
	var NuovoElencoLezioni = [];

	for(var s=0; s <= 13; s++)
	{
		var ContainerLista = document.querySelector('#calendar > div.fc-view-harness.fc-view-harness-passive > div > div');

		var IndicatoreListaVuota = ContainerLista.querySelector('div > div.fc-list-empty-cushion');
		const ListaVuota = IndicatoreListaVuota != null && IndicatoreListaVuota.innerHTML == 'Non ci sono eventi da visualizzare';

		if(!ListaVuota)
		{
			var Lista = ContainerLista.querySelector('table > tbody');

			var giorno, mese, anno, DataFormattata;
			for(var NumRiga=0; NumRiga < Lista.childElementCount; NumRiga++)
			{
				//var ElemRiga = RestituisciElementoTurno(g, t);
				var ElemRiga = Lista.querySelector('tr:nth-child(' + (NumRiga+1) + ')');
				if(ElemRiga == null) break;

				if(ElemRiga.classList.contains('fc-day') && ElemRiga.classList.contains('fc-day-future') )
				{
					//La riga è l'intestazione di un giorno
					const GiornoSettimana = ElemRiga.querySelector('th > div > a.fc-list-day-text').innerHTML; //es. "lunedì"
					const DataEstesa = ElemRiga.querySelector('th > div > a.fc-list-day-side-text').innerHTML; //es. "13 settembre 2021"
					DataFormattata = GiornoSettimana.substr(0, 3) + ' ' + DataEstesa.split(' ')[0] + ' ' + DataEstesa.split(' ')[1].substr(0, 3)

					const DataYMD = ElemRiga.getAttribute('data-date'); //es. 2021-09-13

					giorno = DataYMD.split('-')[2];
					mese = DataYMD.split('-')[1];
					anno = DataYMD.split('-')[0];
				}
				else if(ElemRiga.classList.contains('fc-event') && ElemRiga.classList.contains('fc-event-future') )
				{
					//La riga è una lezione
					const orario = ElemRiga.querySelector('td.fc-list-event-time').innerHTML; //es. 9:00 - 10:45
					const OraInizio = orario.split(' - ')[0].split(':')[0];
					const MinutoInizio = orario.split(' - ')[0].split(':')[1];
					const DataCompleta = new Date(anno, mese, giorno, OraInizio, MinutoInizio)

					const ColorePallino = ElemRiga.querySelector('td.fc-list-event-graphic > span').style.borderColor;
					const InsegnamentoCapsLock = ElemRiga.querySelector('td.fc-list-event-title > a').innerHTML;
					const insegnamento = InsegnamentoCapsLock[0] + InsegnamentoCapsLock.substr(1, InsegnamentoCapsLock.length-1).toLowerCase();

					const prenotato = (ColorePallino == verde);
					const pieno = (ColorePallino == rosso);

					const LezionePrecedenteLettura = GetLezione(DataCompleta, orario, insegnamento);
					if(LezionePrecedenteLettura == null)
					{
						var suono = new Audio(SuonoNuovaLezionePubblicata);
						suono.play();
					}
		
					var elem = { data: DataCompleta,
								dataStringa: DataFormattata,
								ora: orario,
								insegnamento: insegnamento,
								prenotato: prenotato,
								pieno: pieno,
								prenotare: (LezionePrecedenteLettura != null ? LezionePrecedenteLettura.prenotare : PrenotareDefault),
								dataPrenotazione: ( (LezionePrecedenteLettura != null && prenotato) ? LezionePrecedenteLettura.dataPrenotazione : null),
								dataUltimoTentativo: (LezionePrecedenteLettura != null ? LezionePrecedenteLettura.dataUltimoTentativo : null)
								};
					NuovoElencoLezioni.push(elem);
				}
			}
		}
		await BottoneAvanti.click();
		await sleep(200);
	}

	ElencoLezioni = NuovoElencoLezioni;
	localStorage.setItem('ElencoLezioni', JSON.stringify(ElencoLezioni));
	OraUltimoControllo = new Date();

	// Aggiorno lista mostrata nella UI
	var ElemElencoLezioni = document.getElementById('ElencoLezioni');
	var CodiceElencoLezioni = '';
	for(var i=0; i<ElencoLezioni.length; i++)
	{
		const elem = ElencoLezioni[i];

		var ColoreSfondo;
		if(elem.prenotato) ColoreSfondo = 'lightgreen';
		else if(elem.prenotare) ColoreSfondo = 'yellow';
		else ColoreSfondo = 'unset';

		var BadgePrenotabilità = '';
		if(elem.pieno) BadgePrenotabilità = ' <span style="font-size: 80%; background-color: red; color: white; border-radius: 5px; padding: 3px;">PIENA</span>';
		else if(!elem.prenotato) BadgePrenotabilità = ' <span style="font-size: 80%; background-color: dodgerblue; color: white; border-radius: 5px; padding: 3px;">PRENOTABILE</span>';

		var InizioGiornoConPiuLezioni = false;
		if(ElencoLezioni[i+1] != null && ElencoLezioni[i].data.getDate() != ElencoLezioni[i+1].data.getDate() &&
		ElencoLezioni[i+2] != null && ElencoLezioni[i+1].data.getDate() == ElencoLezioni[i+2].data.getDate() ) InizioGiornoConPiuLezioni = true;

		var FineGiornoConPiuLezioni = false;
		if(ElencoLezioni[i-1] != null && ElencoLezioni[i].data.getDate() == ElencoLezioni[i-1].data.getDate() &&
		ElencoLezioni[i+1] != null && ElencoLezioni[i].data.getDate() != ElencoLezioni[i+1].data.getDate() ) FineGiornoConPiuLezioni = true;

		CodiceElencoLezioni +=
		`<label id="CasellaLezione` + i + `" style="display: block; padding: 8px 0 8px 8px; margin: 0; background-color: ` + ColoreSfondo + `; color: black;">
			<input type="checkbox" style="vertical-align: top" id="CheckboxLezione` + i + `" ` + (elem.prenotato ? 'disabled' : (elem.prenotare ? 'checked' : '') ) + ` />
			<span>` + elem.dataStringa + ' 🕖&nbsp;' + elem.ora.replace(' - ', '&nbsp;-&nbsp;') + 
				'<div>' + elem.insegnamento + BadgePrenotabilità + '</div>' +
				(elem.prenotato ? '<div style="font-face: bold; color: green">✔️Prenotata' +
				(elem.dataPrenotazione != null ? ' il ' + FormattaData(new Date(elem.dataPrenotazione)) : '') + '</div>' : '') +
			`</span>
		</label>` +
		( (InizioGiornoConPiuLezioni || FineGiornoConPiuLezioni) ? '<hr style="margin: 2px 0" />' : '');
	}
	ElemElencoLezioni.innerHTML = CodiceElencoLezioni;
	for(i=0; i<ElencoLezioni.length; i++) document.getElementById('CheckboxLezione' + i).addEventListener('click', ClickCasellaLezione.bind(null, i));

	if(ElencoLezioni.length == 0) ElemElencoLezioni.innerHTML = `<div style="text-align: center; font-size: 120%; padding: 8px"><div style="font-size: 300%; font-weight: bold; color: gray; font-family: helvetica">Ø</div>Non ho trovato lezioni nella tua agenda!</div>`;

	BottoneOggi = document.querySelector("#calendar > div.fc-header-toolbar.fc-toolbar.fc-toolbar-ltr > div:nth-child(1) > button");
	await BottoneOggi.click();
}

async function EseguiPrenotazioni()
{
	//TODO
}

function CalcolaProssimoRiavvio()
{
	var HoQualcosaDaFare;
    if(localStorage.getItem('PrenotaNuoveLezioni') == 'true') HoQualcosaDaFare = true;
    else
    {
        HoQualcosaDaFare = false;
        for(var i=0; i < ElencoLezioni.length; i++)
        {
            if(ElencoLezioni[i].prenotare && !ElencoLezioni[i].prenotato) { HoQualcosaDaFare = true; break; }
        }
    }

    if(!HoQualcosaDaFare)
    {
        TimestampProssimoRiavvio = null;

        // Aggiorno UI
        document.getElementById('ON').style.display = 'none';
        document.getElementById('OFF').style.display = 'block';
        document.title = document.title.replace('⚡', '');
        Attività('Nessun ordine inserito');

        // Cancello timer
        if(TimerProssimoRiavvio != null) { clearTimeout(TimerProssimoRiavvio); TimerProssimoRiavvio = null; }
        if(TimerTieniAggiornataDataRiavvio != null) { clearTimeout(TimerTieniAggiornataDataRiavvio); TimerTieniAggiornataDataRiavvio = null; }
        if(TimerAggiornaCountdown != null) { clearTimeout(TimerAggiornaCountdown); TimerAggiornaCountdown = null; }
    }
    else
    {
        // Aggiorno UI
        if(document.getElementById('ON').style.display == 'none')
        {
            document.title = '⚡' + document.title;
            document.getElementById('ON').style.display = 'block';
            document.getElementById('OFF').style.display = 'none';
        }

        // Calcolo quanto manca; se già passato, eseguo riavvio
        const frequenzaMs = GetFrequenzaControlliMinuti() * 60000;
        TimestampProssimoRiavvio = OraUltimoControllo.getTime() + frequenzaMs;
        const MsMancanti = TimestampProssimoRiavvio - (new Date()).getTime();

        if(MsMancanti < 0) { RicaricaPagina('Devo eseguire un nuovo controllo'); return; }

        // Aggiorno attività in corso nella UI, e imposto il suo aggiornamento periodico
        AttivaCountdownRefresh();

        // Imposto timer (sovrascrivendoli se già esistenti)
        if(TimerProssimoRiavvio != null) clearTimeout(TimerProssimoRiavvio);
        TimerProssimoRiavvio = setTimeout(RicaricaPagina.bind(null, 'Devo eseguire un nuovo controllo'), MsMancanti);

        if(TimerTieniAggiornataDataRiavvio != null) clearTimeout(TimerTieniAggiornataDataRiavvio);
        TimerTieniAggiornataDataRiavvio = setInterval(CalcolaProssimoRiavvio, 60000);
    }
}

function AttivaCountdownRefresh()
{
    const MsMancanti = TimestampProssimoRiavvio - (new Date()).getTime();
    Attività('Attendo prossimo aggiornamento pagina (tra ' + FormattaLassoTempo(MsMancanti) + ')');

    //Adatto l'intervallo di aggiornamento dell'attività in corso in base a quanto manca
    var IntervCountdownUI;
    if(MsMancanti < 315000) IntervCountdownUI = 1000; //vengono visualizzati i secondi: necessario aggiornare ogni secondo
    else if(MsMancanti < 600000) IntervCountdownUI = 15000; //vengono visualizzati solo i minuti, posso aggiornare meno spesso
    else IntervCountdownUI = 60000; //vengono visualizzati solo i minuti, posso aggiornare meno spesso

    if(TimerAggiornaCountdown != null) clearTimeout(TimerAggiornaCountdown);
    TimerAggiornaCountdown = setInterval(AggiornaCountdown, IntervCountdownUI);
}

function AggiornaCountdown()
{
    if(PrenotazioniInCorso > 0) return;
    const MsMancanti = TimestampProssimoRiavvio - (new Date()).getTime();
    const MsMancantiFormattati = MsMancanti >= 10000 ? FormattaLassoTempo(MsMancanti) : '<b>' + FormattaLassoTempo(MsMancanti) + '</b>';
    if(MsMancanti > 0) Attività('Attendo prossimo aggiornamento pagina (tra ' + MsMancantiFormattati + ')');
}

function Attività(stringa)
{
    var elem = document.getElementById('attività');
    if(elem != null) elem.innerHTML = stringa;
}

async function RicaricaPagina(msg)
{
    const throbber = '<img alt="🔄" width="25" height="25" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0ibWFyZ2luOiBhdXRvOyBiYWNrZ3JvdW5kOiBub25lOyBkaXNwbGF5OiBibG9jazsgc2hhcGUtcmVuZGVyaW5nOiBhdXRvOyIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiPgo8Zz4KICA8cGF0aCBkPSJNNTAgMjJBMjggMjggMCAxIDAgNzUuODY4NjI2OTEwMzE2MDIgMzkuMjg0ODYzODkzNzc3NDg0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzNzg4ZDgiIHN0cm9rZS13aWR0aD0iMjAiPjwvcGF0aD4KICA8cGF0aCBkPSJNNDkgLTNMNDkgNDdMNzQgMjJMNDkgLTMiIGZpbGw9IiMzNzg4ZDgiPjwvcGF0aD4KICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGR1cj0iMXMiIHZhbHVlcz0iMCA1MCA1MDszNjAgNTAgNTAiIGtleVRpbWVzPSIwOzEiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KPC9nPgo8IS0tIFtsZGlvXSBnZW5lcmF0ZWQgYnkgaHR0cHM6Ly9sb2FkaW5nLmlvLyAtLT48L3N2Zz4=" />';
    if(msg == null) Attività(throbber + 'Ricarico la pagina');
    else Attività(throbber + msg + ': ricarico la pagina');

    // Ordina il refresh e cicla finché la pagina non si è ricaricata
    while(true)
    {
        window.location.reload();
        await sleep(30000);
    }
}

async function ClickCasellaLezione(indice)
{
	var CheckBox = document.getElementById('CheckboxLezione' + indice);
	var casella = CheckBox.parentElement;

	ElencoLezioni[indice].prenotare = CheckBox.checked;
	localStorage.setItem('ElencoLezioni', JSON.stringify(ElencoLezioni));

	if(ElencoLezioni[indice].prenotato == true) casella.style.backgroundColor = 'lightgreen';
	else if(ElencoLezioni[indice].prenotare == true) casella.style.backgroundColor = 'yellow';
	else casella.style.backgroundColor = 'unset';

	CalcolaProssimoRiavvio();
	await EseguiPrenotazioni();
}

function ClickPrenotaNuoveLezioni()
{
	localStorage.setItem('PrenotaNuoveLezioni', document.getElementById('PrenotaNuoveLezioni').checked);
    CalcolaProssimoRiavvio();
}

function CambiamentoFrequenza(ForzaLivello)
{
	var Slider = document.getElementById('FrequenzaSlider');
	var Label = document.getElementById('FrequenzaLabel');
	var livello = (ForzaLivello != null ? ForzaLivello : Slider.value);
	Slider.value = livello;
	if(ForzaLivello == null) localStorage.setItem('frequenza', livello);
	if(ForzaLivello == null) CalcolaProssimoRiavvio();

	if(livello == -3)
	{
		Label.innerHTML = 'ogni ora';
		Label.style.color = '#4de34d';
		Slider.style.background = '#6ee86e';
	} else if(livello == -2)
	{
		Label.innerHTML = 'ogni 20 minuti';
		Label.style.color = '#3EBE00';
		Slider.style.background = '#3EBE00';
	} else if(livello == -1)
	{
		Label.innerHTML = 'ogni 8 minuti';
		Label.style.color = 'green';
		Slider.style.background = 'green';
	} else if(livello == 0)
	{
		Label.innerHTML = 'ogni 3 minuti';
		Label.style.color = '#005CC8';
		Slider.style.background = '#005CC8';
	} else if(livello == 1)
	{
		Label.innerHTML = 'ogni 1 minuto e 30';
		Label.style.color = '#b2b200';
		Slider.style.background = '#FFE118';
	} else if(livello == 2)
	{
		Label.innerHTML = 'ogni 45 secondi';
		Label.style.color = '#FF8100';
		Slider.style.background = '#FF8100';
	} else if(livello == 3)
	{
		Label.innerHTML = 'ogni 15 secondi';
		Label.style.color = '#E10000';
		Slider.style.background = '#E10000';
	}
}

function GetFrequenzaControlliMinuti()
{
	const storage = localStorage.getItem('frequenza');
	if(storage == null) return 3;
	else
	{
		if(Number(storage) == -3) return 60;
		else if(Number(storage) == -2) return 20;
		else if(Number(storage) == -1) return 8;
		else if(Number(storage) == 0) return 3;
		else if(Number(storage) == 1) return 1.5; //1 minuto e 30
		else if(Number(storage) == 2) return 0.75; //45 secondi
		else if(Number(storage) == 3) return 0.25; //15 secondi
	}
}

function GetLezione(DataCercata, OraCercata, InsegnamentoCercato)
{
	for(var i=0; i<ElencoLezioni.length; i++)
	{
		const DataIterata = new Date(ElencoLezioni[i].data);
		if(	DataIterata.getTime() == DataCercata.getTime() &&
			ElencoLezioni[i].ora == OraCercata &&
			ElencoLezioni[i].insegnamento == InsegnamentoCercato
		) return ElencoLezioni[i];
	}
	return null; //non trovato
}

function FormattaLassoTempo(millisecondi)
{
	if(millisecondi < 1000) return '0,' + Math.floor(millisecondi/100) + 's';
	else if(millisecondi < 60000) return Math.floor(millisecondi/1000) + 's';
	else if(millisecondi < 300000) return Math.floor(millisecondi/60000) + '&nbsp;min&nbsp;' + Math.floor((millisecondi % 60000)/1000) + 's';
	else return Math.floor(millisecondi/60000) + '&nbsp;minuti';
}

function FormattaData(data)
{
	return data.getDate() + ' ' + DaNumeroANomeMese(data.getMonth(), true) + ' alle ' + data.getHours() + (data.getMinutes() < 10 ? ':0' : ':') + data.getMinutes();
}

function StessoGiornoMeseAnno(Data1, Data2)
{
	if(Data1 == null || Data2 == null) return false;
	if(Data1.getDate() == Data2.getDate() && Data1.getMonth() == Data2.getMonth() && Data1.getFullYear() == Data2.getFullYear() )
		{ return true; }
	else
		{ return false; }
}

function DaNomeANumeroMese(StringaMese)
{
	if(StringaMese == 'gen') return 1;
	else if(StringaMese == 'feb') return 2;
	else if(StringaMese == 'mar') return 3;
	else if(StringaMese == 'apr') return 4;
	else if(StringaMese == 'mag') return 5;
	else if(StringaMese == 'giu') return 6;
	else if(StringaMese == 'lug') return 7;
	else if(StringaMese == 'ago') return 8;
	else if(StringaMese == 'set') return 9;
	else if(StringaMese == 'ott') return 10;
	else if(StringaMese == 'nov') return 11;
	else if(StringaMese == 'dic') return 12;
}

function DaNumeroANomeMese(NumeroMese, VersioneLunga)
{
	if(VersioneLunga == null) VersioneLunga = false;

	if(NumeroMese == 0) return (VersioneLunga ? 'gennaio' : 'gen');
	else if(NumeroMese == 1) return (VersioneLunga ? 'febbraio' : 'feb');
	else if(NumeroMese == 2) return (VersioneLunga ? 'marzo' : 'mar');
	else if(NumeroMese == 3) return (VersioneLunga ? 'aprile' : 'apr');
	else if(NumeroMese == 4) return (VersioneLunga ? 'maggio' : 'mag');
	else if(NumeroMese == 5) return (VersioneLunga ? 'giugno' : 'giu');
	else if(NumeroMese == 6) return (VersioneLunga ? 'luglio' : 'lug');
	else if(NumeroMese == 7) return (VersioneLunga ? 'agosto' : 'ago');
	else if(NumeroMese == 8) return (VersioneLunga ? 'settembre' : 'set');
	else if(NumeroMese == 9) return (VersioneLunga ? 'ottobre' : 'ott');
	else if(NumeroMese == 10) return (VersioneLunga ? 'novembre' : 'nov');
	else if(NumeroMese == 11) return (VersioneLunga ? 'dicembre' : 'dic');
}

function DaNumeroANomeGiornoSettimana(GiornoSettimana)
{
	if(GiornoSettimana == 0) return 'dom';
	else if(GiornoSettimana == 1) return 'lun';
	else if(GiornoSettimana == 2) return 'mar';
	else if(GiornoSettimana == 3) return 'mer';
	else if(GiornoSettimana == 4) return 'gio';
	else if(GiornoSettimana == 5) return 'ven';
	else if(GiornoSettimana == 6) return 'sab';
}

function sleep(ms)
{
	return new Promise(resolve => setTimeout(resolve, ms));
}