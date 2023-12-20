document.addEventListener('DOMContentLoaded', function() {
    const clientId = 'clientId-QCRIUF60I5';
    const host = 'ws://broker.hivemq.com:8000/mqtt';
    const options = {
        keepalive: 60,
        clientId: clientId,
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        will: {
            topic: 'WillMsg',
            payload: 'Connection Closed abnormally..!',
            qos: 0,
            retain: false
        },
    };

    console.log('Connecting mqtt client');
    const client = mqtt.connect(host, options);

    client.on('error', (err) => {
        console.log('Connection error: ', err);
        client.end();
    });

    client.on('reconnect', () => {
        console.log('Reconnecting...');
    });

    client.on('connect', () => {
        console.log(`Client connected: ${clientId}`);
        // Subscribe
        client.subscribe('/home/sensor/temperature', {
            qos: 0
        });
        client.subscribe('/home/sensor/humidity', {
            qos: 0
        });
        client.subscribe('/home/sensor/voltage', {
            qos: 0
        });
    });

    // Receive
    client.publish('/home/sensor/temperature', 'Test message ...', {
        qos: 0,
        retain: false
    })

    client.on('message', (topic, message, packet) => {
        console.log(`Received Message: ${message.toString()} On topic: ${topic}`);
        updateSensorData(topic, message.toString());
    });

    function updateSensorData(topic, data) {
        if (topic === '/home/sensor/temperature') {
            document.getElementById('temperature').innerHTML = data;
        } else if (topic === '/home/sensor/humidity') {
            document.getElementById('humidity').innerHTML = data;
        } else if (topic === '/home/sensor/voltage') {
            document.getElementById('voltage').innerHTML = data;
        }
    }

    // Handle switch state change for fan
    document.getElementById('toggle-fan').addEventListener('change', function() {
        const state = this.checked ? 'ON' : 'OFF';
        client.publish('/home/fan/control', state, {
            qos: 0,
            retain: false
        });
    });

    // Handle switch state change for LED
    document.getElementById('toggle-led').addEventListener('change', function() {
        const state = this.checked ? 'ON' : 'OFF';
        client.publish('/home/light/control', state, {
            qos: 0,
            retain: false
        });
    });

    // Handle switch state change for heater
    document.getElementById('toggle-heater').addEventListener('change', function() {
        const state = this.checked ? 'ON' : 'OFF';
        client.publish('/home/heater/control', state, {
            qos: 0,
            retain: false
        });
    });
});