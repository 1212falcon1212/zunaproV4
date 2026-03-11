package nats

import (
	"fmt"

	"github.com/nats-io/nats.go"
)

func Connect(url, authToken string) (*nats.Conn, error) {
	opts := []nats.Option{
		nats.Name("zunapro-provisioner"),
	}
	if authToken != "" {
		opts = append(opts, nats.Token(authToken))
	}

	nc, err := nats.Connect(url, opts...)
	if err != nil {
		return nil, fmt.Errorf("connecting to NATS at %s: %w", url, err)
	}

	return nc, nil
}

func Subscribe(nc *nats.Conn, subject string, handler func(data []byte)) error {
	_, err := nc.Subscribe(subject, func(msg *nats.Msg) {
		handler(msg.Data)
	})
	if err != nil {
		return fmt.Errorf("subscribing to %s: %w", subject, err)
	}

	return nil
}

func Publish(nc *nats.Conn, subject string, data []byte) error {
	if err := nc.Publish(subject, data); err != nil {
		return fmt.Errorf("publishing to %s: %w", subject, err)
	}
	return nil
}
