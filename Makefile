build:
	gcloud builds submit --tag gcr.io/tww-simulation/tww-simulation

deploy:
	gcloud run deploy --image gcr.io/tww-simulation/tww-simulation --platform managed	tww-simulation

.PHONY: build deploy
