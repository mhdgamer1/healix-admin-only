import styles from './LogoImage.module.css'
const LogoImage = ({className}) => {
  return (
    <div className={`floatedDiv md:block hidden ${className}`}>
    <div className={`${styles.image}`}>
        <img src="../LogoRegister.png" alt="logo" className='object-cover h-[100%] w-[100%]' />
      </div>
    </div>
  )}
export default LogoImage
