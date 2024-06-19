
import React from 'react'
import { View, Button, Dialog, XStack, YStack} from 'tamagui'
import { Link } from 'expo-router'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'
import { FontAwesome5 } from '@expo/vector-icons';

import * as Clipboard from 'expo-clipboard';

export default function groupContentScreen(){
    const [copiedText, setCopiedText] = React.useState('');
    const copyToClipboard = async() => {
        try{
          await Clipboard.setStringAsync('000000');
          var roomNumber = await Clipboard.getStringAsync();
        }
        catch (e) {
          console.log(e)
        }
        setCopiedText(roomNumber);
      };
    const router = useRouter()
    return(
        <View bg={Colors.bg} alignItems="center" justifyContent="center" flex={1}>   
        <Dialog modal>
          <Dialog.Trigger asChild>
            <Button>Show room number</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay
              key="overlay"
              animation="quick"
              opacity={0.5}
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
            <Dialog.Content
              bg={Colors.primary}
              height="23%"
              width="80%"
              bordered
              elevate
              key="content"
              animation={[
                'quick',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
              enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
              exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
              x={0}
              scale={1}
              opacity={1}
              y={0}
            >
          <YStack alignItems="center" justifyContent="center">
            <Dialog.Title color={Colors.text} fontSize={20}>
              group name
            </Dialog.Title>
            <View height="7%" />
            <XStack height="30%" alignItems="center" >
            <Dialog.Title color={Colors.text} fontSize={20}>
              房號
            </Dialog.Title>
            <View width="5%" />
            <View bg={Colors.input_bg} width="35%" height="100%" alignItems="center" justifyContent="center" px="1%">
          
            <Dialog.Description color={Colors.text}>
              000000
            </Dialog.Description>
            
            </View>
            <Button bg={Colors.primary} onPress={copyToClipboard}>
            <FontAwesome5 name="copy" size={24} color="black"/>
          </Button> 
            </XStack>
            <View height="10%" />
            <Dialog.Close displayWhenAdapted asChild>
            <Button 
                theme="active" 
                aria-label="Close"
                bg={Colors.button_primary} 
                borderRadius={20}
                width="40%"
            >
                close
            </Button>
             
            </Dialog.Close>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
            
            <Link href="/group">return</Link>
        </View>
    )
    
}
