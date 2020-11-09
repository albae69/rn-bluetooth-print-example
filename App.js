import React, {useEffect, useState} from 'react';
import {View, Text, DeviceEventEmitter} from 'react-native';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
} from '@cloudgakkai/react-native-bluetooth-escpos-printer';

const App = () => {
  const [bluetooth, setBluetooth] = useState(false);
  const [devices, setDevices] = useState(null);

  // check is bluetooth enable / disable
  const checkBluetoothEnable = async () => {
    await BluetoothManager.isBluetoothEnabled().then((res) => {
      if (res == false) {
        setBluetooth(res);
        alert('bluetooh is disable');
      } else {
        setBluetooth(res);
      }
    });
  };

  // enable bluetooth
  const enableBluetooth = async () => {
    await BluetoothManager.enableBluetooth()
      .then((res) => {
        let paired = [];
        if (res && res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            try {
              paired.push(res[i]);
            } catch (error) {
              // ignore
            }
          }
        }

        setDevices(paired);
      })
      .catch((e) => console.log(e));
  };

  // disable bluetooth
  const disableBluetooth = async () => {
    await BluetoothManager.disableBluetooth()
      .then((res) => alert(res))
      .catch((e) => console.log(e));
  };

  // sample with events
  const eventDevices = () => {
    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
      (res) => {
        console.log('ALREADY PAIRED', res);
      },
    );
    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_DEVICE_FOUND,
      (res) => {
        console.log('FOUND', res);
      },
    );
  };

  // scan devices
  const scanDevice = async () => {
    await BluetoothManager.scanDevices()
      .then((res) => {
        setDevices(res.devices);
      })
      .catch((e) => console.log(e));
  };

  // connect to devices
  const connectDevices = async () => {
    await BluetoothManager.connect('66:22:85:15:54:60')
      .then((res) => {
        alert(res);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    console.log(devices);
  }, []);

  return (
    <View>
      <Text
        onPress={async () => {
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          await BluetoothEscposPrinter.setBlob(0);
          await BluetoothEscposPrinter.printText('SIKASIR\n\r', {
            codepage: 0,
            widthtimes: 2,
            heigthtimes: 2,
            fonttype: 1,
          });
          await BluetoothEscposPrinter.setBlob(0);
          await BluetoothEscposPrinter.printText(
            'by Pondok Programmer\n\r',
            {},
          );
          await BluetoothEscposPrinter.setBlob(0);
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.LEFT,
          );
          await BluetoothEscposPrinter.printText('KASIR：WAK SIS\n\r', {});
          await BluetoothEscposPrinter.printText('ID KASIR：69\n\r', {});
          await BluetoothEscposPrinter.printText(
            'NOMOR TRANSAKSI：69696969699\n\r',
            {},
          );
          await BluetoothEscposPrinter.printText(
            '--------------------------------\n\r',
            {},
          );
          let columnWidths = [6, 12, 12];
          await BluetoothEscposPrinter.printColumn(
            columnWidths,
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.CENTER,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            ['qty', 'name', 'price'],
            {},
          );
          await BluetoothEscposPrinter.printColumn(
            columnWidths,
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.CENTER,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            ['10', 'Indomie Grg', 'Rp.2500'],
            {},
          );
          await BluetoothEscposPrinter.printText('\n\r', {});
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.RIGHT,
          );
          await BluetoothEscposPrinter.printText(
            'Total Belanja : IDR.30000\n\r',
            {},
          );
          await BluetoothEscposPrinter.printText('Bayar : IDR.50000\n\r', {});
          await BluetoothEscposPrinter.printText('Kembali : IDR.20000\n\r', {});
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          await BluetoothEscposPrinter.printText('\n\r', {});

          await BluetoothEscposPrinter.printText('TERIMA KASIH\n\r', {});
          await BluetoothEscposPrinter.printText(
            '--------------------------------\n\r',
            {},
          );
        }}
        style={{fontSize: 65}}>
        print
      </Text>
      <Text onPress={enableBluetooth} style={{fontSize: 65}}>
        enable bt
      </Text>
      <Text onPress={disableBluetooth} style={{fontSize: 65}}>
        disable bt
      </Text>
      <Text onPress={scanDevice} style={{fontSize: 65}}>
        scan devices
      </Text>
      <Text onPress={connectDevices} style={{fontSize: 65}}>
        connect devices
      </Text>
    </View>
  );
};

export default App;
