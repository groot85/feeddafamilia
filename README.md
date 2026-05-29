# feeddafamilia
**Projeto de extensão universitária focado em coleta de dados e impacto social**

Este projeto foi desenvolvido como parte do Projeto de Extensão IV — Coleta de Informações (PEX IV) do curso de Engenharia de Software (UniAmérica Descomplica).

O objetivo principal do projeto foi criar e aplicar uma intervenção tecnológica prática capaz de coletar, processar e exibir de forma dinâmica informações que analisam a proximidade e o conhecimento mútuo entre pais/responsáveis e filhos.

**Metodologia: No-Code & AI-Powered**
Toda a lógica de programação, estilização responsiva e gerenciamento de estados dinâmicos foi concebida de forma No-Code, utilizando interações em linguagem natural e prototipagem rápida através do Gemini Canvas. Isso permitiu uma entrega ágil focada na arquitetura da informação, usabilidade (UX) e no impacto social da coleta de dados em tempo real.

**Tecnologias Utilizadas**
Front-end: HTML5 semântico, JavaScript moderno (ES6+) e Tailwind CSS para design responsivo e fluído.
Banco de Dados & BaaS: Google Firebase (Cloud Firestore) para persistência de dados NoSQL e sincronização dinâmica em tempo real.
Biblioteca de Ícones: Lucide Icons para uma interface limpa e intuitiva.
Arquitetura: Projeto estruturado sob o conceito de Single-Page Application (SPA) com atualizações de interface reativas.

**Funcionalidades e Fluxo de Coleta de Dados**
Triagem de Perfil: O usuário escolhe se responderá ao desafio como "Responsável" (falando sobre o filho) ou "Estudante" (falando sobre o pai/mãe).
Seletor de Emojis: Escolha de um emoji visual para representar de forma lúdica a pessoa homenageada.
Formulário Adaptativo: As perguntas mudam dinamicamente dependendo do perfil (ex: pede "Profissão" para os pais e "Turma Escolar" para os estudantes).
Perguntas Norteadoras: Coleta dados qualitativos e quantitativos sobre:
Dia e mês de aniversário
Preferências pessoais (música, cor, comida favorita)
Aspectos emocionais e sociais (traços de admiração, momentos engraçados e talentos).
Mural em Tempo Real: Visualização dinâmica dos cartões com ordenação automática dos dados publicados, sem risco de sobreposição de informações.

**Como Executar e Configurar**
Para rodar este projeto localmente ou hospedá-lo no seu próprio servidor, você precisará configurar uma instância no Firebase.
**1. Configurar o Firebase Firestore**
Crie um projeto no Console do Firebase.
Vá em Firestore Database e clique em Criar Banco de Dados.

Defina as regras de segurança para o Modo de Teste (permite leitura e escrita temporária):
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

Ative o provedor de autenticação Anônimo em Authentication > Sign-in method.

**2. Substituir as Credenciais no Código**
No arquivo index.html (ou na versão React family_feed.jsx), localize o objeto firebaseConfig e insira as suas chaves geradas pelo console do Firebase:

const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_AUTH_DOMAIN_AQUI",
    projectId: "SEU_PROJECT_ID_AQUI",
    storageBucket: "SEU_STORAGE_BUCKET_AQUI",
    messagingSenderId: "SEU_SENDER_ID_AQUI",
    appId: "SEU_APP_ID_AQUI"
};

**3.Hospedar**

Este projeto pode ser executado diretamente abrindo o arquivo index.html em qualquer navegador, incorporado ao Google Sites, ou publicado em plataformas como GitHub Pages, Vercel ou Netlify.

**Licença**
Este projeto é de código aberto e está licenciado sob os termos da Licença MIT.
_Projeto desenvolvido com dedicação para cumprir as diretrizes de extensão universitária e impacto na comunidade local._
