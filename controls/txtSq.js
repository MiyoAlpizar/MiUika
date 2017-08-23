import React,{Component} from 'react'
import{
    View,
    TextInput,
    StyleSheet
} from 'react-native'
import { Icon } from 'react-native-elements'
import colors from '../globals/colors'

export default class txtSq extends Component
{
    constructor(props)
    {
        super(props)
    }

    focus()
    {
        this._txt.focus()
    }

    render()
    {
        return(
            
            <View style={styles.txtBox}>
                    {this.props.icon?<Icon name={this.props.icon} color={colors.Primary} type={this.props.type?this.props.type:'material-icon'} />:null}
                    <TextInput
                        ref = {(r)=>{this._txt = r;}}
                        selectionColor={colors.Primary} 
                        style={styles.txtInput} 
                        placeholder={this.props.placeholder} 
                        placeholderTextColor={this.props.placeholderTextColor?this.props.placeholderTextColor:colors.Bg3} 
                        value={this.props.value} 
                        onChangeText={this.props.onChangeText}
                        keyboardType={this.props.keyboardType?this.props.keyboardType:'default'}
                        returnKeyType={this.props.returnKeyType?this.props.returnKeyType:'default'}
                        autoCapitalize={this.props.autoCapitalize?this.props.autoCapitalize:'sentences'}
                        secureTextEntry={this.props.secureTextEntry?this.props.secureTextEntry:false}
                        onSubmitEditing={this.props.onSubmitEditing?this.props.onSubmitEditing:null}
                        autoFocus={this.props.autoFocus?this.props.autoFocus:false}
                        autoCorrect={this.props.autoCorrect!=null?this.props.autoCorrect:true}
                        maxLength={this.props.maxLength?this.props.maxLength:60}
                        />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    txtBox:
    {
        borderWidth:1,
        borderColor: colors.Bg3,
        backgroundColor:'rgba(255,255,255,0.2)',
        height:50,
        justifyContent: 'space-between',
        flexDirection:'row',
        paddingLeft:15,
        marginLeft:15,
        marginRight:15,
        marginBottom:5
        
    },
    txtInput:
    {
        flex:1,
        marginLeft:15,
        color:"#fff"
    }
});