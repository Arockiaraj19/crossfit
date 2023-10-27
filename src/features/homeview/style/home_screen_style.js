import { StyleSheet, Platform,Dimensions,} from 'react-native';
import { colors, fonts, images } from '../../../core';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.background_color,
    },
    view_header: {
        width: '100%',
        height: (Platform.OS == 'android') ? 60 : 90,
        backgroundColor: colors.white_color,
    },
    scrollContainer: {
        width: '100%',
        height: 200,
    },
    view: {
        marginTop: 0,
        // backgroundColor: 'blue',
        width: width - 70,
        margin: 10,
        height: 200,
        borderRadius: 11,
        overflow: 'hidden',
    },
    text_Name: {
        marginLeft: 20,
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 18,
        color: colors.white_color,
    },
    text_Description: {
        marginTop: 5,
        marginLeft: 20,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 12,
        color: colors.white_color,
    },
    lotBox: {
        marginTop: 30,
        width: '90%',
        borderRadius: 15,
        backgroundColor: colors.white_color,
        shadowColor: "#000",
        shadowOffset: {
            width: 0, height: 7
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    linearGradient: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        width: 40,
        height: 40,
        borderRadius: 20
    },
    text_Lot: {
        marginLeft: 10,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 18,
        color: colors.text_Color,
    },
    text_LotTitle: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        textAlign: 'center',
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 13,
        color: colors.text_Color,
    },
    text_seller: {
        marginLeft: 10,
        marginRight: 10,
        textAlign: 'center',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 13,
        color: colors.white_color,
    },
    text_viewMore: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 15,
        color: colors.text_Color,
    },
    text_Bids: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        textAlign: 'center',
        width: '100%',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 13,
        color: colors.white_color,
    },
    sharpEdge: {
        // marginLeft: -100,
        width: 0,
        height: 0,
        // borderLeftWidth: 100,
        // borderRightWidth: 100,
        // borderBottomWidth: 130,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#00a5eb',
        transform: [{ rotate: '270deg' }]
    },
    text_premium: {
        marginTop: 5,
        marginLeft: 10,
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 18,
        color: colors.white_color,
    },
    text_successful: {
        marginTop: 3,
        marginLeft: 10,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 14,
        color: colors.white_color,
    },
    view_click: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 34,
        width: 90,
        marginLeft: 10,
        marginTop: 5,
        borderRadius: 17,
        borderColor: '#00a5eb',
        borderWidth: 1,
        color: colors.white_color,
    },
    text_Clcik: {
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 14,
        color: colors.white_color,
    },
    text_day: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 16,
        color: colors.white_color,
    },
    text_Bonus: {
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 18,
        color: colors.white_color,
        textAlign: 'center',
        marginLeft: 12
    },
    text_MandiRate: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 16,
        color: colors.black_color,
        // textTransform: 'uppercase'
    },
    text_real: {
        marginTop: 5,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 11,
        color: colors.black_color,
    },
    view_checkRate: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 130,
        borderRadius: 5,
        backgroundColor: '#b1f9d4'
    },
    text_checkRate: {
        textAlign: 'center',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
        color: '#222222',
    },
    text_clinic: {
        textAlign: 'center',
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 14,
        color: colors.black_color,
    },
    text_clinic_content: {
        textAlign: 'center',
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 12,
        color: colors.black_color,
    },
    text_clickhere: {
        textAlign: 'center',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
        color: '#2d5274',
    },
    myActivity: {
        marginTop: 30,
        width: '90%',
        borderRadius: 15,
        backgroundColor: colors.white_color,
        shadowColor: "#000",
        shadowOffset: {
            width: 0, height: 7
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    activity_text: {
        marginLeft: 10,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 16,
        color: colors.text_Color,
    },
    activity_btn: {
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 10,
        borderRadius: 5,
        width: 100,
        minHeight: 45,
        // backgroundColor: '#b1f9d4'
        backgroundColor: "green"
    },
    activity_btn_text: {
        textAlign: 'center',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
        // color: '#222222',
        color: colors.text_Color
    },
    activity_linearGradient: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        width: 90,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        height: 70,
    }
});


export default styles;