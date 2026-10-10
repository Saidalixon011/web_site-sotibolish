import React, { useState, useRef } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Tag, 
  Row, 
  Col, 
  message,
  Modal
} from 'antd';
import { 
  Globe, 
  ExternalLink, 
  Send, 
  User, 
  Sparkles, 
  Code2, 
  Layers, 
  ShieldCheck, 
  Camera,
  RotateCcw
} from 'lucide-react';
import './home.css';

const { TextArea } = Input;

const portfolioProjects = [
  {
    id: 'e-commerce-pro',
    title: 'E-Commerce Online Do\'kon Pro',
    category: 'Internet Do\'kon',
    price: '$350',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
    pinterestUrl: 'https://www.pinterest.com/pin/1083679222784572211/',
    description: 'To\'liq funksional savat, to\'lov tizimlari va admin panelga ega zamonaviy e-commerce sayt.',
    tags: ['React', 'Redux', 'Tailwind']
  },
  {
    id: 'restaurant-cart',
    title: 'Restoran va Kafe Sayti',
    category: 'Menyu & Onlayn Buyurtma',
    price: '$250',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    pinterestUrl: 'https://www.pinterest.com/pin/861327553738096338/',
    description: 'Interaktiv taomlar menyusi, stollarni band qilish va onlayn buyurtma berish moduli.',
    tags: ['React', 'Ant Design', 'Responsive']
  },
  {
    id: 'lms-education',
    title: 'Ta\'lim Platformasi (IELTS & Kurslar)',
    category: 'LMS Platforma',
    price: '$400',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    pinterestUrl: 'https://www.pinterest.com/pin/687376024395471241/',
    description: 'Listening, Reading va lug\'at modullariga ega o\'quv platformasi.',
    tags: ['React', 'CSS Modules', 'Interactive']
  }
];

const Home = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const BOT_TOKEN = "8922121969:AAG1_bwe3V4761egviJ4UyBSqRLtmO56ico";
  const CHAT_ID = "8302148294";

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '').slice(0, 9);
    let formatted = '';
    if (numbers.length > 0) formatted += numbers.slice(0, 2);
    if (numbers.length > 2) formatted += ' ' + numbers.slice(2, 5);
    if (numbers.length > 5) formatted += ' ' + numbers.slice(5, 7);
    if (numbers.length > 7) formatted += ' ' + numbers.slice(7, 9);
    return formatted;
  };

  const startCamera = async () => {
    setIsModalVisible(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      message.error('Kameraga ulanishda xatolik yuz berdi!');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsModalVisible(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageUrl);
      message.success('Rasm muvaffaqiyatli olindi!');
      stopCamera();
    }
  };

  const dataURLtoBlob = (dataurl) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  };

  const onFinish = async (values) => {
    setLoading(true);

    const textMessage = `
YANGI BUYURTMA KELDI!

Ism: ${values.firstName}
Familiya: ${values.lastName}
Loyiha Nomi: ${values.projectName}
Maqsadi: ${values.sitePurpose}
Aloqa Raqami: +998 ${values.phone}
Rasm: ${capturedImage ? 'Biriktirilgan' : 'Olinmagan'}
    `.trim();

    try {
      if (capturedImage) {
        const blob = dataURLtoBlob(capturedImage);
        const formData = new FormData();
        formData.append("chat_id", CHAT_ID);
        formData.append("photo", blob, "logo.png");
        formData.append("caption", textMessage);

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          method: "POST",
          body: formData,
        });
      } else {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: textMessage
          })
        });
      }

      message.success('Buyurtmangiz Telegram botga yuborildi!');
      form.resetFields();
      setCapturedImage(null);
    } catch (error) {
      message.error('Yuborishda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={16} /> Professional Web Dasturlash
        </div>
        <h1 className="hero-title">
          Biznesingiz uchun <span className="highlight">Zamonaviy Web Saytlar</span>
        </h1>
        <p className="hero-subtitle">
          Tezkor, 100% mobil responsive va mukammal dizayndagi web-saytlarni buyurtma qiling.
        </p>
        <div className="hero-actions">
          <a href="#buy-section" className="btn-link">
            <Button type="primary" size="large" icon={<Send size={18} />}>
              Buyurtma berish
            </Button>
          </a>
          <a href="#projects-section" className="btn-link">
            <Button size="large" icon={<Layers size={18} />}>
              Tayyor loyihalar
            </Button>
          </a>
        </div>
      </section>

      <section className="about-section">
        <div className="section-header">
          <User className="section-icon" />
          <h2>Men Haqimda</h2>
        </div>
        <div className="about-card">
          <h3 className="about-title">Salom!</h3>
          <p className="about-text">
            Front-end web dasturlash sohasida <strong>2 yillik tajribaga</strong> egaman. React, CSS, Ant Design va boshqa zamonaviy texnologiyalar yordamida tezkor, chiroyli va qulay saytlarni yarataman.
          </p>
        </div>
      </section>

      <section id="projects-section" className="projects-section">
        <div className="section-header">
          <Code2 className="section-icon" />
          <h2>Tayyor Web Sayt Loyihalari</h2>
          <p className="section-desc">Dizayn va tuzilmalarni ko'rib chiqing va o'zingizga yoqqanini tanlang</p>
        </div>

        <Row gutter={[24, 24]}>
          {portfolioProjects.map((project) => (
            <Col xs={24} sm={12} lg={8} key={project.id}>
              <Card
                hoverable
                className="project-card"
                cover={<img alt={project.title} src={project.image} className="project-img" />}
              >
                <div className="project-card-header">
                  <Tag color="blue">{project.category}</Tag>
                  <span className="project-price">{project.price}</span>
                </div>
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.description}</p>
                
                <div className="project-tags">
                  {project.tags.map((tag, idx) => (
                    <Tag key={idx}>{tag}</Tag>
                  ))}
                </div>

                <div className="project-card-actions">
                  <a href={project.pinterestUrl} target="_blank" rel="noopener noreferrer" className="pinterest-btn">
                    <ExternalLink size={16} /> Pinterest Demosi
                  </a>
                  <Button 
                    type="primary" 
                    ghost 
                    onClick={() => {
                      form.setFieldsValue({ projectName: project.title });
                      const element = document.getElementById('buy-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Tanlash
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section id="buy-section" className="buy-section">
        <div className="section-header">
          <ShieldCheck className="section-icon" />
          <h2>Buyurtma Berish</h2>
          <p className="section-desc">Ma'lumotlarni qat'iy va to'g'ri to'ldiring</p>
        </div>

        <div className="form-wrapper">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="order-form"
            size="large"
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="firstName"
                  label="Ismingiz"
                  rules={[
                    { required: true, message: 'Ismingizni kiriting!' },
                    { min: 2, message: 'Ism kamida 2 ta harfdan iborat bo\'lishi kerak!' }
                  ]}
                >
                  <Input placeholder="Ismingizni kiriting" prefix={<User size={18} className="input-icon" />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="lastName"
                  label="Familiyangiz"
                  rules={[
                    { required: true, message: 'Familiyangizni kiriting!' },
                    { min: 2, message: 'Familiya kamida 2 ta harfdan iborat bo\'lishi kerak!' }
                  ]}
                >
                  <Input placeholder="Familiyangizni kiriting" prefix={<User size={18} className="input-icon" />} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="projectName"
              label="Loyiha Nomi / Turi"
              rules={[
                { required: true, message: 'Loyiha nomini kiriting!' },
                { min: 3, message: 'Loyiha nomi qisqacha bo\'lmasin!' }
              ]}
            >
              <Input placeholder="Masalan: Restoran sayti yoki E-Commerce" prefix={<Code2 size={18} className="input-icon" />} />
            </Form.Item>

            <Form.Item
              name="sitePurpose"
              label="Sayt Nima Uchun Kerak (Qisqacha Maqsadi)"
              rules={[
                { required: true, message: 'Maqsadini yozing!' },
                { min: 10, message: 'Iltimos, maqsadni batafsiroq yozing (kamida 10 ta belgi)!' }
              ]}
            >
              <TextArea rows={3} placeholder="Masalan: Mahsulot sotish va mijozlarni jalb qilish uchun..." />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Telefon raqamingiz"
              rules={[
                { required: true, message: 'Telefon raqamni kiriting!' },
                { pattern: /^\d{2}\s\d{3}\s\d{2}\s\d{2}$/, message: 'Raqamni to\'liq va to\'g\'ri kiriting (9 ta raqam)' }
              ]}
            >
              <Input 
                addonBefore="+998" 
                placeholder="90 123 45 67" 
                maxLength={12}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  form.setFieldsValue({ phone: formatted });
                }}
              />
            </Form.Item>

            <Form.Item label="Logotip / Rasm biriktirish (Kamera)">
              <div className="camera-section-box">
                <Button type="dashed" onClick={startCamera} icon={<Camera size={18} />} block>
                  Kamerani ochib rasmga olish
                </Button>
                {capturedImage && (
                  <div className="captured-preview">
                    <p className="preview-label">Olingan rasm:</p>
                    <img src={capturedImage} alt="Captured preview" className="preview-img" />
                    <Button size="small" type="link" onClick={startCamera} icon={<RotateCcw size={14} />}>
                      Qayta rasmga olish
                    </Button>
                  </div>
                )}
              </div>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading}
                icon={<Send size={20} />} 
                className="submit-btn"
              >
                Buyurtmani Yuborish
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>

      <Modal
        title="Kamera Orqali Rasmga Olish"
        open={isModalVisible}
        onCancel={stopCamera}
        footer={[
          <Button key="capture" type="primary" onClick={capturePhoto} icon={<Camera size={16} />}>
            Rasmga Olish
          </Button>,
          <Button key="close" onClick={stopCamera}>
            Yopish
          </Button>
        ]}
      >
        <div className="video-container">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="live-video" 
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </Modal>

      <footer className="footer">
        <p>© 2026 Web Development Services. Barcha huquqlar himoyalangan.</p>
        <p className="footer-sub">Telegram: <a href="https://t.me/Saidalixon_946" target="_blank" rel="noreferrer">@Saidalixon_946</a></p>
      </footer>
    </div>
  );
};

export default Home;