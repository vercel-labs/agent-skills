package main

import (
	"fmt"
	"net/http"
	"os"

	handler "github.com/test/backend/api"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	http.HandleFunc("/health", handler.Handler)

	fmt.Printf("Go backend listening on :%s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
}
