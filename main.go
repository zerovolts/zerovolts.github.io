package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
)

var templates struct {
	home   *template.Template
	bezier *template.Template
}

func main() {
	templates.home = template.Must(template.ParseFiles("./templates/index.html", "./templates/header.html"))
	templates.bezier = template.Must(template.ParseFiles("./templates/bezier.html", "./templates/header.html"))

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
	templates.home.Execute(w, nil)
}

func bezier(w http.ResponseWriter, r *http.Request) {
	templates.bezier.Execute(w, nil)
}
