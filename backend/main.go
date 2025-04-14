package main

import (
	"calculator/gen/calculator/v1"
	"calculator/gen/calculator/v1/calculatorv1connect"
	"context"
	"fmt"
	"net/http"

	"connectrpc.com/connect"
)

type CalculatorServer struct{}

func (s *CalculatorServer) Calculate(
	ctx context.Context,
	req *connect.Request[calculatorv1.CalculateRequest],
) (*connect.Response[calculatorv1.CalculateResponse], error) {
	op1 := req.Msg.Operand1
	op2 := req.Msg.Operand2
	operator := req.Msg.Operator

	var result float64
	switch operator {
	case "+":
		result = op1 + op2
	case "-":
		result = op1 - op2
	case "*":
		result = op1 * op2
	case "/":
		if op2 == 0 {
			return nil, connect.NewError(connect.CodeInvalidArgument, fmt.Errorf("division by zero"))
		}
		result = op1 / op2
	default:
		return nil, connect.NewError(connect.CodeInvalidArgument, fmt.Errorf("invalid operator"))
	}

	res := connect.NewResponse(&calculatorv1.CalculateResponse{
		Result: result,
	})
	return res, nil
}

func main() {
	calculator := &CalculatorServer{}
	mux := http.NewServeMux()
	path, handler := calculatorv1connect.NewCalculatorServiceHandler(calculator)
	mux.Handle(path, handler)

	fmt.Printf("Service mounted on path: %s\n", path)

	http.ListenAndServe(":8080", mux)

	// Enable CORS
	/*
		corsHandler := cors.New(cors.Options{
			AllowedOrigins: []string{"http://localhost:3000"},
			AllowedMethods: []string{"GET", "POST", "OPTIONS"},
			AllowedHeaders: []string{"Content-Type"},
		})

		log.Println("Server started on :8080")
		http.ListenAndServe(
			"localhost:8080",
			corsHandler.Handler(mux),
		)*/
}
