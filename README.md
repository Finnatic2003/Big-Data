Autoren:  
Thanadon Chiangkham (9002977)  
Lars Lönne (1412338)  
Nils Loomans (4850429)  
Finn Münstermann (3071508)  
Jan Waldmann (7952189)

 
# Dokumentation der Wein Anwendung
## 1. Idee der Anwendung
Unsere Anwendung ist eine einfache Darstellung der Weinnachfrage. Ziel dabei war eine Umsetzung, die auf Big Data Technologien basiert und dabei insbesondere Apache Spark und eine Kappa-Architektur verwendet.

## 2. Systemarchitektur

### 2.1 Kappa-Architektur
Die Kappa-Architektur bildet das Rückgrat unserer Anwendung und sorgt für eine robuste und skalierbare Datenverarbeitung. Sie besteht aus den folgenden Schichten:

#### 2.1.1 Ingestion Layer
Die Ingestion Layer ist für die Aufnahme der Daten verantwortlich. In unserer Anwendung wird Apache Kafka verwendet, um die Daten in das System einzuspeisen. Kafka fungiert als Nachrichtenschlange, die Klickdaten empfängt.
•	Apache Kafka: In unserer Wein Anwendung sammelt Kafka die Klickdaten, die durch Benutzerinteraktionen mit den Produkten generiert werden. Diese Klickdaten werden dann an die nächste Verarbeitungsstufe weitergeleitet.
#### 2.1.2 Stream Processing Layer
Die Stream Processing Layer übernimmt die Verarbeitung der Datenströme, die von der Ingestion Layer eingespeist werden. Apache Spark wird in dieser Schicht verwendet, um die Klickdaten zu verarbeiten und die Nachfrage der Weine dynamisch anzupassen.
•	Apache Spark: Ein Spark-Job liest kontinuierlich die Klickdaten aus den Kafka-Topics und analysiert diese. Basierend auf den eingehenden Klickdaten zeigt Spark die Nachfrage für die Produkte. Diese kontinuierliche Verarbeitung ermöglicht es der Anwendung, schnell auf Änderungen zu reagieren und die Nachfrage entsprechend anzupassen. 

#### 2.1.3 Serving Layer
Die Serving Layer ist die abschließende Schicht der Kappa-Architektur und ist für die Speicherung und Bereitstellung der verarbeiteten Daten verantwortlich. In unserer Anwendung werden die verarbeiteten Daten in einer MariaDB-Datenbank gespeichert.
•	MariaDB: MariaDB ist eine leistungsfähige relationale Datenbank, die die verarbeiteten Nachfragedaten speichert. Die Datenbank dient als Backend für die Web-UI, die die aktuelle Nachfrage der Produkte anzeigt. Durch die Speicherung in MariaDB können die Nachfragedaten schnell und effizient abgerufen werden, was eine reibungslose und responsive Benutzererfahrung gewährleistet.
## 3. Implementierung
### 3.1 Ingestion Layer
Apache Kafka mit Strimzi: Die Implementierung beginnt mit der Bereitstellung eines Kafka-Clusters in Kubernetes mittels Strimzi. Strimzi ist ein Operator für das Management von Kafka in Kubernetes und ermöglicht die einfache Bereitstellung und Verwaltung eines Kafka-Clusters innerhalb eines Kubernetes-Clusters.
•	Kafka-Producer: Ein Kafka-Producer sendet Klickdaten an ein Kafka-Topic. Diese Daten repräsentieren Benutzerinteraktionen mit den Produkten, beispielsweise das Klicken auf Produktlinks.
•	Kafka-Cluster: Der Kafka-Cluster läuft auf Kubernetes und wird durch Strimzi verwaltet. Dies bietet hohe Verfügbarkeit und Skalierbarkeit, da Kafka in einem verteilten System betrieben wird.
### 3.2 Stream Processing Layer
•	Apache Spark: Ein Spark-Job liest die Klickdaten kontinuierlich von Kafka und verarbeitet diese. Die Nachfrage nach den Produkten wird anhand der Anzahl der Klicks dynamisch angepasst.
•	Hadoop: Hadoop wird genutzt, um historische Klickdaten zu speichern. Diese Daten werden für Batch-Processing und tiefere Analysen verwendet. Durch die Speicherung in einem Hadoop-basierten Data Lake können umfangreiche Datenmengen effizient gespeichert und verarbeitet werden.

### 3.3 Serving Layer
MariaDB: Die Nachfragedaten werden in eine MariaDB-Datenbank geschrieben. Diese Datenbank speichert die aktuelle Nachfrage der Produkte und dient als Backend für die Web-UI.
•	Datenpersistenz: Die Speicherung der Nachfragedaten erfolgt in einer strukturierten Form, die schnelle Lesezugriffe ermöglicht.
•	Integration mit Spark: Spark schreibt die Nachfragedaten direkt in die MariaDB-Datenbank, was eine zeitnahe Aktualisierung der Nachfragedaten gewährleistet.
### 3.4 Web-UI
Web-UI-Entwicklung: Eine Webanwendung wird entwickelt, die die aktuelle Nachfrage der Produkte anzeigt. Diese Anwendung ruft die Daten aus der MariaDB-Datenbank ab und aktualisiert die Anzeige in Echtzeit.
•	Visualisierung: Die Nachfrage wird nahezu in Echtzeit aktualisiert, wodurch Benutzer die dynamische Anpassung der Nachfrage unmittelbar nachvollziehen können.
•	Benutzerinteraktion: Benutzer können durch ihre Klicks auf die Produkte die Nachfrageentwicklung beeinflussen, was die Interaktivität der Anwendung erhöht.
### 3.5 Node.Js
Zusätzlich zu den bestehenden Technologien haben wir Node.js als Backend-Plattform in unserer Nachfrage Anwendung integriert. Node.js spielt eine zentrale Rolle bei der Verwaltung der Kommunikation zwischen der Web-UI und der MariaDB-Datenbank. Es stellt sicher, dass die Nachfragedaten effizient abgerufen und an das Frontend gesendet werden können.
### 3.6 Skaffold
In unserem Projekt haben wir Skaffold verwendet, um das gesamte Cluster und die erforderlichen Komponenten zu starten und zu verwalten. Skaffold ermöglichte es uns, die Kubernetes-Ressourcen für Apache Kafka mit Strimzi, Apache Spark Streaming und MariaDB effizient bereitzustellen. Wir haben Skaffold konfiguriert, um die verschiedenen Docker-Images zu bauen und zu verteilen, die für die Anwendung erforderlich waren, einschließlich der Kafka-Producer, Spark-Jobs und der MariaDB-Datenbank.

# Big-Data

## Probleme

Aufgrund der Arbeitslaptops die leider wenig Rechenleistung zur Verfügung haben, läuft es nicht ohne zu crashen.

![image](https://github.com/user-attachments/assets/9a0fd5c7-de05-495d-adc4-15dbce34ed03)
![image](https://github.com/user-attachments/assets/e4f9f4f9-b1a7-478d-9b0a-04909b783ff0)

Außerdem zwingt es uns dazu, nach jedem skaffold dev, mehrere Minuten zu warten, was die debugging Arbeit noch erschwert.


Es wurde jedoch auf dem Laptop eines Komilitonen getestet sodass es läuft.

![image](https://github.com/user-attachments/assets/9f8efbf3-423a-4a58-a7f2-fd2b1c45b5cc)

Screencast ebenfalls auf dem Laptop eines Komilitionen erstellt.
Hier Screencast link maybe idk

Abschließend würden wir gerne hinzufügen, dass uns das Projekt sehr schwer fiel, da wir in allen Bereichen (bspw. Datenbankanbindung, Arbeiten mit Docker, Containern, Kubernetes etc.) wenig bis keine Vorerfahrung hatten.
