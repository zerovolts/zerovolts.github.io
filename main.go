package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("static")))

	port := os.Getenv("PORT")
	if port == "" {
		// Development mode
		log.Fatal(http.ListenAndServe("localhost:8080", nil))
	} else {
		// Production mode
		log.Fatal(http.ListenAndServe(":"+port, nil))
	}
}
