package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
)

func main() {
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", home)
	http.HandleFunc("/bezier/", bezier)

	port := os.Getenv("PORT")
	if port == "" {
		// Development mode
		log.Fatal(http.ListenAndServe("localhost:8008", nil))
	} else {
		// Production mode
		log.Fatal(http.ListenAndServe(":"+port, nil))
	}
}

func home(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./templates/index.html", "./templates/header.html"))
	tmpl.Execute(w, nil)
}

func bezier(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./templates/bezier.html", "./templates/header.html"))
	tmpl.Execute(w, nil)
}
