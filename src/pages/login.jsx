import { Grid2, Typography } from '@mui/material';
import LoginAdminForm from '../pages/user/LoginAdminForm';
import UserForm from '@/components/formularios/UserForm';
import { useState, useEffect } from 'react';
import { useMyUserContext } from "@/context/userContext";

export default function LoginPage() {
    const {user, setUser, isUser, isAdmin} = useMyUserContext();
    const [registerView, setRegisterView] = useState(false);

    useEffect(() => {
        // Prevenir el scroll del body
        document.body.style.overflow = 'hidden';
        // Ajustar la altura del viewport en móviles
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        // Actualizar en cambios de orientación o resize
        const handleResize = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    const toggleView = () => {
        setRegisterView(!registerView);
    }

    const handleRegisterSuccess = () => {
        setRegisterView(false); // Cambiar a la vista de login
    }

    return (
        <Grid2
            container
            sx={{
                backgroundColor: "#e8621d",
                position: "fixed",
                height: "calc(var(--vh, 1vh) * 100)",
                top: 0,
                width: "100%",
                left: 0,
                padding: 0,
                margin: 0,
                boxSizing: "border-box",
                justifyContent: "center",
                alignItems: "center",
                overflowY: "auto",
                overflowX: "hidden",
                WebkitOverflowScrolling: "touch",
                minHeight: "-webkit-fill-available",
            }}
        >
            <Grid2 
                sx={{
                    display: "flex", 
                    flexDirection: "column",
                    width: "100%",
                    maxWidth: "100vw",
                    padding: "20px",
                    boxSizing: "border-box",
                }}
            >
                {registerView ? (
                    <>
                        <UserForm onRegisterSuccess={handleRegisterSuccess} />
                        <Typography
                            onClick={toggleView}
                            variant="body2"
                            sx={{
                                color: "white",
                                margin: "20px auto",
                                cursor: "pointer",
                                textAlign: "center",
                            }}
                        >
                            Ya tengo una cuenta
                        </Typography>
                    </>
                ) : (
                    <>
                        <LoginAdminForm />
                        <Typography
                            onClick={toggleView}
                            variant="body2"
                            sx={{
                                color: "white",
                                margin: "20px auto",
                                cursor: "pointer",
                                textAlign: "center",
                            }}
                        >
                            No tengo una cuenta
                        </Typography>
                    </>
                )}
            </Grid2>
            <style jsx global>{`
                html {
                    height: -webkit-fill-available;
                }
                body {
                    min-height: -webkit-fill-available;
                    margin: 0;
                    padding: 0;
                }
            `}</style>
        </Grid2>
    );
}

LoginPage.getLayout = function getLayout(page) {
    return page;
};
