# KI-Tutor Web-App
Dieses Projekt bietet eine Web-App zur Interaktion mit KI-Tutoren basierend auf der OpenAI Assistant API. Die Web-App ermöglicht es Benutzern, Fragen zu stellen und Antworten von KI-Tutoren zu erhalten. Die Web-App wurde mit [Next.js](https://nextjs.org/) und [Chat UI Kit React](https://github.com/chatscope/chat-ui-kit-react)  erstellt.

Der KI-Tutor basiert auf der OpenAI Assistant API. In diesem Repository befindet sich eine Web-App, die aus Frontend und Backend besteht. Das Frontend bietet ein Chat-Interface zur Interaktion, während das Backend die Anfragen verarbeitet und sicher an die OpenAI API weiterleitet, um den API-Schlüssel zu schützen.


## Installation und Ausführung

Es werden `Node.js` und `npm` benötigt, um das Projekt auszuführen.
1.	Öffne ein Terminal und navigiere in das Verzeichnis des geklonten Repositories.
2.	Installiere die benötigten Abhängigkeiten mit dem Befehl `npm install`.
3.	Füge deinen OpenAI API Key, Organisations_ID sowie die Assistant_ID in die Datei `.env-example` ein und benenne diese anschließend in `.env` um.
4.	Starte den lokalen Entwicklungsserver mit `npm run dev`.
5.	Rufe die angegebene URL im Browser auf (standardmäßig [http://localhost:3000](http://localhost:3000)).

## Dateistruktur

- `app/` - Enthält die React-Komponenten und Seiten der Web-App.
- `app/page.tsx` - Ist in der aktuellen Version die Hauptseite und die einzige Seite der Web-App. Hier ist das Frontend der Web-App implementiert.
- `api/` - Enthält die Backend-API-Endpunkte
- `api/threads/route.ts` - API-Endpunkt zum Erstellen eines neuen Threads
- `api/threads/[id]/route.ts` - API-Endpunkt zum senden einer neuen Nachricht in einem Thread
- `.env-example` - Beispiel-Datei für Umgebungsvariablen
- `docker-compose-sample.yml` - Beispiel-Datei für Docker-Compose-Konfiguration
- `Dockerfile` - Docker-Datei für die Erstellung eines Docker-Images von der Web-App.
- `cypress/e2e/ki-tutor.cy.js` - Enthält die End-to-End-Tests für die Web-App.

## Tests

Dieses Projekt verwendet Cypress für End-to-End-Tests. Befolge die folgenden Schritte, um die Tests auszuführen.

### Schritt 1: Web-App bauen und starten

Zuerst musst du die Web-App bauen und den Server starten. Führe dazu den folgenden Befehl aus:

```bash
npm run build && npm run start
```

### Schritt 2: Cypress Test Runner öffnen

Als Nächstes öffnest du den Cypress Test Runner, indem du folgenden Befehl ausführst:

```bash
npm run cypress:open
```

Dieser Befehl öffnet die Cypress Test Runner-Oberfläche. Von dort aus kannst du die Tests auswählen und ausführen.

**Hinweis**: Stelle sicher, dass die Umgebungsvariablen wie oben beschrieben eingerichtet sind.

## Verwendete Hilfsmittel
- [Next.js Docs](https://nextjs.org/)
- [Chat UI Kit React](https://github.com/chatscope/chat-ui-kit-react)
- [OpenAI API Docs](https://platform.openai.com/docs/assistants/overview)
- [OpenAI Assistants API Quickstart](https://github.com/openai/openai-assistants-quickstart)
- Github Copilot
