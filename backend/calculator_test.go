package main

import (
	"context"
	"net/http"
	"testing"

	"calculator/gen/calculator/v1"
	"calculator/gen/calculator/v1/calculatorv1connect"
	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
)

func TestCalculatorService(t *testing.T) {
	t.Parallel()

	server := &CalculatorServer{}

	tests := []struct {
		name     string
		req      *calculatorv1.CalculateRequest
		expected float64
		wantErr  bool
	}{
		{
			name: "addition",
			req: &calculatorv1.CalculateRequest{
				Operand1: 10,
				Operand2: 20,
				Operator: "+",
			},
			expected: 30,
		},
		{
			name: "division by zero",
			req: &calculatorv1.CalculateRequest{
				Operand1: 10,
				Operand2: 0,
				Operator: "/",
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			req := connect.NewRequest(tt.req)
			res, err := server.Calculate(context.Background(), req)

			if tt.wantErr {
				assert.Error(t, err)
				return
			}

			assert.NoError(t, err)
			assert.Equal(t, tt.expected, res.Msg.Result)
		})
	}
}

func TestHandlerRegistration(t *testing.T) {
	t.Parallel()

	server := &CalculatorServer{}
	mux := http.NewServeMux()
	path, handler := calculatorv1connect.NewCalculatorServiceHandler(server)
	mux.Handle(path, handler)

	assert.NotEmpty(t, path)
	assert.NotNil(t, handler)
}
