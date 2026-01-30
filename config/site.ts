import { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  siteName: "Lingyi Zhou",
  siteUrl: "https://lingyi.dev",
  defaultTitle: "Lingyi Zhou - XR & Game Developer",
  titleTemplate: "%s | Lingyi Zhou",
  defaultDescription: "Portfolio of Lingyi Zhou, an XR Developer and Game Designer specializing in Unity, AR/VR, and 3D Design.",
  defaultOgImage: "https://picsum.photos/1200/630",
  twitterHandle: "@reatured",
  email: "zeroonelatte@gmail.com",
  jobTitle: "XR Developer @ Artly.ai",
  location: "New York, NY",
  bio: "Ex. AR Engineer @ Snap Inc.\nEx. Unity Engineer @ Unity\nMFA Design and Technology @ Parsons\nMA Game Design & Development @ Columbia",
  avatar: "https://picsum.photos/400/400?grayscale",
  keywords: ["XR", "Unity", "AR", "VR", "Game Design", "3D Modeling", "React", "Full Stack"],
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/#projects" },
    { label: "About", href: "/#about" },
  ],
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/reatured", icon: "Github" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/lingyi-zhou", icon: "Linkedin" },
    { platform: "Instagram", url: "https://instagram.com/reatured", icon: "Instagram" },
    { platform: "Mail", url: "mailto:zeroonelatte@gmail.com", icon: "Mail" },
  ],
  roles: [
    {
      title: "XR Developer",
      details: [
        "AR Development in Lens Studio & Effect House.",
        "VR Development in Unity for Oculus Quest and Apple Vision Pro"
      ]
    },
    {
      title: "Game Developer",
      details: [
        "Unity Development for desktop and mobile games",
        "Shader knowledge and development experience"
      ]
    },
    {
      title: "3D Designer",
      details: [
        "Blender and Maya for stylized and realistic modeling and rendering",
        "Cinema4D for animation and procedural modelling"
      ]
    },
    {
      title: "Full Stack Engineer",
      details: [
        "React front end + FastAPI Backend + Postgre database"
      ]
    },
    {
      title: "Graphic Designer",
      details: [
        "Adobe Indesign, Adobe Illustrator"
      ]
    }
  ]
};