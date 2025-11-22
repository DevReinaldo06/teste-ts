import 'dotenv/config'; 

import express, { Express, Request, Response } from "express";
import { PrismaClient, Paciente } from '@prisma/client';
import cors from 'cors'; // Importa a biblioteca CORS

const prisma = new PrismaClient();
const app: Express = express();
const port: number = 3000;

// CONFIGURAÇÃO DE MIDDLEWARE
// Habilita o CORS para todas as origens ('*') - CORREÇÃO CRÍTICA PARA CONEXÃO REMOTA
app.use(cors()); 
app.use(express.json());

// Interface para garantir o formato correto dos dados de entrada
interface PacienteInput {
    nome: string;
    dataNascimento?: string; 
    telefone?: string; 
}


// Função principal que orquestra a conexão com o BD e o início do servidor
async function main() {
    try {
        await prisma.$connect();
        console.log('✅ Conexão com o Banco de Dados (Render) estabelecida!');

        // ----------------------------------------------------
        // ROTAS DE CRUD PARA PACIENTES
        // ----------------------------------------------------

        // Rota de teste (Health Check)
        app.get("/", (req: Request, res: Response) => {
            res.status(200).json({ status: 'API Online', db: 'Conectado ao Render. Use /pacientes para o CRUD.' });
        });

        // GET ALL /pacientes
        app.get("/pacientes", async (req: Request, res: Response) => {
            const pacientes: Paciente[] = await prisma.paciente.findMany({
                orderBy: { id: 'asc' }
            });
            res.json(pacientes);
        });

        // GET ONE /pacientes/:id
        app.get("/pacientes/:id", async (req: Request, res: Response) => {
            const id: number = parseInt(req.params.id, 10);

            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ message: "ID inválido." });
            }
            
            const paciente: Paciente | null = await prisma.paciente.findUnique({
                where: { id: id }
            });

            if (!paciente) {
                return res.status(404).json({ message: "Paciente não encontrado" });
            }
            res.json(paciente);
        });

        // POST /pacientes (Criar Novo Paciente)
        app.post("/pacientes", async (req: Request<{}, {}, PacienteInput>, res: Response) => {
            const { nome, dataNascimento, telefone } = req.body;

            if (typeof nome !== 'string' || nome.trim() === "") {
                return res.status(400).json({ message: "O nome é obrigatório." });
            }

            try {
                const novoPaciente: Paciente = await prisma.paciente.create({
                    data: {
                        nome,
                        dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
                        telefone
                    }
                });
                res.status(201).json(novoPaciente);

            } catch (error) {
                // Tratamento de erro aprimorado
                console.error("Erro ao criar paciente:", error); 

                // CORREÇÃO: Trata o erro de telefone duplicado (P2002)
                if (error instanceof Error && 'code' in error && error.code === 'P2002') {
                    // Retorna 409 Conflict em vez de 500
                    return res.status(409).json({ message: "Já existe um paciente com este telefone (campo único)." });
                }
                
                // Se for um erro de conexão com o BD ou outro erro inesperado, retorna 500
                return res.status(500).json({ message: "Erro interno do servidor." });
            }
        });

        // PUT /pacientes/:id (Atualizar Paciente)
        app.put("/pacientes/:id", async (req: Request, res: Response) => {
            const id: number = parseInt(req.params.id, 10);
            const { nome, dataNascimento, telefone } = req.body;

            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ message: "ID inválido." });
            }
            
            const updateData: Partial<Paciente> = {};
            if (nome !== undefined) {
                if (typeof nome !== 'string' || nome.trim() === "") {
                    return res.status(400).json({ message: "O nome não pode estar vazio." });
                }
                updateData.nome = nome;
            }
            if (dataNascimento !== undefined) {
                updateData.dataNascimento = new Date(dataNascimento);
            }
            if (telefone !== undefined) {
                updateData.telefone = telefone;
            }
            
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: "Nenhum dado para atualizar foi fornecido." });
            }

            try {
                const pacienteAtualizado: Paciente = await prisma.paciente.update({
                    where: { id: id },
                    data: updateData
                });
                res.json(pacienteAtualizado);

            } catch (error) {
                if (error instanceof Error && 'code' in error && (error.code === 'P2025' || error.code === 'P2002')) {
                    return res.status(404).json({ message: "Paciente não encontrado ou erro de duplicidade de telefone." });
                }
                console.error("Erro ao atualizar paciente:", error);
                return res.status(500).json({ message: "Erro interno do servidor." });
            }
        });

        // DELETE /pacientes/:id
        app.delete("/pacientes/:id", async (req: Request, res: Response) => {
            const id: number = parseInt(req.params.id, 10);

            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ message: "ID inválido." });
            }
            
            try {
                await prisma.paciente.delete({
                    where: { id: id }
                });
                res.status(204).send(); // Resposta de sucesso sem conteúdo

            } catch (error) {
                if (error instanceof Error && 'code' in error && error.code === 'P2025') {
                    return res.status(404).json({ message: "Paciente não encontrado." });
                }
                console.error("Erro ao deletar paciente:", error);
                return res.status(500).json({ message: "Erro interno do servidor." });
            }
        });
        
        // 3. Inicia o servidor Express APÓS a conexão bem-sucedida
        app.listen(port, () => {
            console.log(`🚀 API da Clínica rodando em http://localhost:${port}`);
        });
        
    } catch (error) {
        // Se a conexão com o BD falhar (erro fatal), o processo Node.js é encerrado
        console.error('❌ FATAL: Falha ao conectar ao Banco de Dados. A API não será iniciada.', error);
        process.exit(1); 
    }
}

// Inicia a função principal
main();