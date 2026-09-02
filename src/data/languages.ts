import { LanguageInfo, ProgrammingLanguage } from '../types';

export const LANGUAGES: LanguageInfo[] = [
  {
    id: 'hibrido',
    name: 'Híbrido (Multi-Lenguaje Automático)',
    extension: 'ts',
    samplePrompt: 'Diseña un sistema completo multi-lenguaje (Frontend TypeScript + Backend Python + Base de Datos SQL + Docker) sincronizado automáticamente.',
    sampleCode: `// ==========================================
// MODO HÍBRIDO MULTI-LENGUAJE AUTOMÁTICO
// Combina TypeScript, Python, SQL y C++ en un solo proyecto sinérgico y funcional.
// ==========================================

export interface HybridProjectConfig {
  projectName: string;
  version: string;
  activeEngines: string[];
  deterministicExecution: boolean;
}

export const HYBRID_SYSTEM_MANIFEST: HybridProjectConfig = {
  projectName: "Proyecto Híbrido Automático Cervantes",
  version: "4.0.0-unlimited",
  activeEngines: ["TypeScript Node.js API", "Python Fast Worker", "PostgreSQL Drizzle Schema", "C++ Zero-Latency Core"],
  deterministicExecution: true,
};

console.log("Inicializando Entorno Híbrido Multi-Lenguaje con Éxito...");
`,
    sampleBuggyCode: `// Ejemplo híbrido con dependencias cruzadas pendientes de resolver automáticamente
function sincronizarModulosHibridos() {
  // FALLA: Falta tipado cruzado entre Python worker y Node.js bridge
  const pipeline = [NodeAPI, PythonWorker, PostgreSQLDB];
  return pipeline.map(mod => mod.executeSync());
}
`
  },
  {
    id: 'python',
    name: 'Python',
    extension: 'py',
    samplePrompt: 'Crea una función para procesar pagos y calcular descuentos con validación de entradas.',
    sampleCode: `def calcular_descuento(precio_base: float, cupon: str, es_miembro: bool) -> float:
    """Calcula el precio final aplicando reglas de descuento seguras."""
    if precio_base < 0:
        raise ValueError("El precio base no puede ser negativo")
        
    descuento = 0.0
    if es_miembro:
        descuento += 0.10  # 10% para miembros
        
    if cupon.upper() == "PROMO20":
        descuento += 0.20
    elif cupon.upper() == "BIENVENIDA50":
        descuento += 0.50
        
    descuento = min(descuento, 0.70)  # Límite máximo de descuento
    precio_final = precio_base * (1.0 - descuento)
    return round(precio_final, 2)

if __name__ == "__main__":
    total = calcular_descuento(100.0, "PROMO20", True)
    print(f"Total a pagar: \${total}")
`,
    sampleBuggyCode: `def procesar_usuarios(usuarios):
    # FALLA 1: Modificar lista mientras se itera
    # FALLA 2: No valida tipos ni None (posible AttributeError)
    # FALLA 3: Variable no inicializada en caso de lista vacia
    for u in usuarios:
        if u["edad"] < 18:
            usuarios.remove(u)
        nombre = u["nombre"].upper()
    return usuarios, nombre
`
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    extension: 'js',
    samplePrompt: 'Crea un manejador asíncrono para consultar datos con reintentos y caché local.',
    sampleCode: `/**
 * Realiza una petición con reintentos exponenciales.
 */
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      return await response.json();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) throw error;
      const delay = Math.pow(2, attempt) * 200;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
`,
    sampleBuggyCode: `function calcularPromedio(numeros) {
  // FALLA 1: División por cero si el arreglo está vacío
  // FALLA 2: Concatenación de strings si los elementos son strings ("1" + "2")
  // FALLA 3: No maneja valores nulos o indefinidos
  var suma = 0;
  for (var i = 0; i <= numeros.length; i++) { // ERROR de índice fuera de rango
    suma += numeros[i];
  }
  return suma / numeros.length;
}
`
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    extension: 'ts',
    samplePrompt: 'Crea un servicio tipado para gestionar un carrito de compras con cálculos de impuestos.',
    sampleCode: `export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export class ShoppingCart {
  private items: Map<string, CartItem> = new Map();

  addItem(item: CartItem): void {
    if (item.quantity <= 0) throw new Error("La cantidad debe ser mayor a 0");
    const existing = this.items.get(item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.set(item.id, { ...item });
    }
  }

  calculateTotal(taxRate: number = 0.16): { subtotal: number; tax: number; total: number } {
    let subtotal = 0;
    for (const item of this.items.values()) {
      subtotal += item.price * item.quantity;
    }
    const tax = subtotal * taxRate;
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round((subtotal + tax) * 100) / 100,
    };
  }
}
`,
    sampleBuggyCode: `interface User {
  id: number;
  profile?: { email: string };
}

function getDomain(user: User): string {
  // FALLA 1: TypeError potencial si profile es undefined
  // FALLA 2: No valida si email contiene '@'
  // FALLA 3: Inseguro ante valores nulos
  return user.profile.email.split('@')[1];
}
`
  },
  {
    id: 'cpp',
    name: 'C++',
    extension: 'cpp',
    samplePrompt: 'Implementa un buffer circular seguro para comunicación entre hilos.',
    sampleCode: `#include <iostream>
#include <vector>
#include <stdexcept>

template <typename T>
class CircularBuffer {
private:
    std::vector<T> buffer;
    size_t head = 0;
    size_t tail = 0;
    size_t count = 0;
    size_t capacity;

public:
    explicit CircularBuffer(size_t cap) : buffer(cap), capacity(cap) {
        if (cap == 0) throw std::invalid_argument("Capacity must be > 0");
    }

    bool push(const T& item) {
        if (count == capacity) return false;
        buffer[tail] = item;
        tail = (tail + 1) % capacity;
        count++;
        return true;
    }

    bool pop(T& item) {
        if (count == 0) return false;
        item = buffer[head];
        head = (head + 1) % capacity;
        count--;
        return true;
    }

    size_t size() const { return count; }
};

int main() {
    CircularBuffer<int> cb(5);
    cb.push(42);
    int val;
    if (cb.pop(val)) {
        std::cout << "Recuperado: " << val << std::endl;
    }
    return 0;
}
`,
    sampleBuggyCode: `#include <iostream>
#include <cstring>

char* copiarCadena(const char* origen) {
    // FALLA 1: Fuga de memoria (memory leak) si el llamador no libera
    // FALLA 2: Buffer overflow si origen es NULL
    // FALLA 3: No asigna espacio para el terminador nulo '\\0'
    char* destino = new char[strlen(origen)];
    strcpy(destino, origen);
    return destino;
}
`
  },
  {
    id: 'c',
    name: 'C',
    extension: 'c',
    samplePrompt: 'Escribe una función de búsqueda binaria y ordenamiento in-place.',
    sampleCode: `#include <stdio.h>

int binary_search(const int arr[], int size, int target) {
    int left = 0;
    int right = size - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    int datos[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = sizeof(datos) / sizeof(datos[0]);
    int pos = binary_search(datos, n, 23);
    printf("Elemento encontrado en indice: %d\\n", pos);
    return 0;
}
`,
    sampleBuggyCode: `#include <stdio.h>
#include <stdlib.h>

void procesarArray(int n) {
    // FALLA 1: Asignación sin verificación de NULL
    // FALLA 2: Fuga de memoria (sin free)
    // FALLA 3: Acceso fuera de rango ptr[n]
    int *ptr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i <= n; i++) {
        ptr[i] = i * 2;
    }
}
`
  },
  {
    id: 'rust',
    name: 'Rust',
    extension: 'rs',
    samplePrompt: 'Crea una estructura segura con manejo de errores Result para procesar pedidos.',
    sampleCode: `#[derive(Debug, PartialEq)]
pub struct Order {
    pub id: u64,
    pub amount: f64,
    pub completed: bool,
}

#[derive(Debug)]
pub enum OrderError {
    InvalidAmount,
    AlreadyCompleted,
}

impl Order {
    pub fn new(id: u64, amount: f64) -> Result<Self, OrderError> {
        if amount <= 0.0 {
            return Err(OrderError::InvalidAmount);
        }
        Ok(Order {
            id,
            amount,
            completed: false,
        })
    }

    pub fn complete(&mut self) -> Result<(), OrderError> {
        if self.completed {
            return Err(OrderError::AlreadyCompleted);
        }
        self.completed = true;
        Ok(())
    }
}
`,
    sampleBuggyCode: `fn dividir_elementos(vector: Vec<i32>, divisor: i32) -> Vec<i32> {
    // FALLA 1: Pánico por división entre cero
    // FALLA 2: No maneja vector vacío
    let mut resultado = Vec::new();
    for &val in vector.iter() {
        resultado.push(val / divisor);
    }
    resultado
}
`
  },
  {
    id: 'go',
    name: 'Go',
    extension: 'go',
    samplePrompt: 'Escribe un pool de trabajadores concurrentes con canales y sync.WaitGroup.',
    sampleCode: `package main

import (
	"fmt"
	"sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	for j := range jobs {
		results <- j * 2
	}
}

func main() {
	const numJobs = 5
	jobs := make(chan int, numJobs)
	results := make(chan int, numJobs)
	var wg sync.WaitGroup

	for w := 1; w <= 3; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	for j := 1; j <= numJobs; j++ {
		jobs <- j
	}
	close(jobs)

	wg.Wait()
	close(results)

	for res := range results {
		fmt.Printf("Resultado: %d\\n", res)
	}
}
`,
    sampleBuggyCode: `package main

func getFirstElement(items []string) string {
    // FALLA 1: Pánico por índice fuera de límites si slice está vacío
    // FALLA 2: No retorna error idiomático en Go
    return items[0]
}
`
  },
  {
    id: 'java',
    name: 'Java',
    extension: 'java',
    samplePrompt: 'Crea una clase bancaria con transacciones sincronizadas y validación de saldo.',
    sampleCode: `public class BankAccount {
    private final String accountNumber;
    private double balance;

    public BankAccount(String accountNumber, double initialBalance) {
        if (initialBalance < 0) {
            throw new IllegalArgumentException("Initial balance cannot be negative");
        }
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    public synchronized void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        this.balance += amount;
    }

    public synchronized boolean withdraw(double amount) {
        if (amount <= 0 || amount > balance) return false;
        this.balance -= amount;
        return true;
    }

    public synchronized double getBalance() {
        return this.balance;
    }
}
`,
    sampleBuggyCode: `public class StringUtils {
    public static boolean checkEquality(String a, String b) {
        // FALLA 1: Uso de == en vez de .equals() para objetos String
        // FALLA 2: NullPointerException potencial si a es nulo
        return a == b;
    }
}
`
  },
  {
    id: 'csharp',
    name: 'C#',
    extension: 'cs',
    samplePrompt: 'Implementa un repositorio genérico con LINQ y operaciones asíncronas.',
    sampleCode: `using System;
using System.Collections.Generic;
using System.Linq;

public class Repository<T> where T : class
{
    private readonly List<T> _items = new();

    public void Add(T item)
    {
        ArgumentNullException.ThrowIfNull(item);
        _items.Add(item);
    }

    public IEnumerable<T> Find(Func<T, bool> predicate)
    {
        return _items.Where(predicate);
    }

    public int Count => _items.Count;
}
`,
    sampleBuggyCode: `public class Calculator {
    public int Divide(int a, int b) {
        // FALLA 1: DivideByZeroException no controlada
        // FALLA 2: Desbordamiento de enteros (overflow) sin comprobación
        return a / b;
    }
}
`
  },
  {
    id: 'php',
    name: 'PHP',
    extension: 'php',
    samplePrompt: 'Crea una clase para sanitizar entradas de usuario y prevenir inyecciones SQL / XSS.',
    sampleCode: `<?php
declare(strict_types=1);

class SecuritySanitizer {
    public static function sanitizeString(string $input): string {
        $trimmed = trim($input);
        return htmlspecialchars($trimmed, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    public static function validateEmail(string $email): ?string {
        $clean = filter_var(trim($email), FILTER_VALIDATE_EMAIL);
        return $clean !== false ? $clean : null;
    }
}
`,
    sampleBuggyCode: `<?php
function getUser($pdo, $id) {
    // FALLA CRITICA: Vulnerabilidad de Inyeccion SQL directa
    // FALLA 2: No valida que $id sea numerico
    $sql = "SELECT * FROM users WHERE id = " . $id;
    return $pdo->query($sql)->fetch();
}
`
  },
  {
    id: 'sql',
    name: 'SQL',
    extension: 'sql',
    samplePrompt: 'Diseña una consulta con agregaciones, índices y control de valores nulos para un reporte de ventas.',
    sampleCode: `-- Reporte de ventas mensuales optimizado
SELECT 
    DATE_TRUNC('month', order_date) AS sales_month,
    category_id,
    COUNT(order_id) AS total_orders,
    COALESCE(SUM(total_amount), 0) AS total_revenue,
    ROUND(AVG(total_amount), 2) AS avg_ticket
FROM orders
WHERE status = 'COMPLETED'
  AND order_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY 1, 2
ORDER BY sales_month DESC, total_revenue DESC;
`,
    sampleBuggyCode: `-- FALLA 1: Producto cartesiano no intencionado (falta JOIN ON)
-- FALLA 2: No maneja NULLs con SUM
SELECT u.name, o.amount 
FROM users u, orders o 
WHERE u.status = 'active';
`
  },
  {
    id: 'bash',
    name: 'Bash',
    extension: 'sh',
    samplePrompt: 'Crea un script seguro de respaldo con verificación de errores y rotación de logs.',
    sampleCode: `#!/usr/bin/env bash
set -euo pipefail

BACKUP_SRC="\${1:-/var/www/html}"
BACKUP_DEST="\${2:-/backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE_NAME="backup_\${TIMESTAMP}.tar.gz"

if [[ ! -d "\$BACKUP_SRC" ]]; then
    echo "Error: El directorio fuente '\$BACKUP_SRC' no existe." >&2
    exit 1
fi

mkdir -p "\$BACKUP_DEST"
tar -czf "\${BACKUP_DEST}/\${ARCHIVE_NAME}" -C "\$BACKUP_SRC" .
echo "Respaldo completado exitosamente: \${BACKUP_DEST}/\${ARCHIVE_NAME}"
`,
    sampleBuggyCode: `#!/bin/bash
# FALLA 1: Sin 'set -e', continúa si falla un paso
# FALLA 2: rm -rf sin comillas puede borrar todo si la variable está vacía
DIR=$1
rm -rf $DIR/*
`
  }
];

export const DEFAULT_LANGUAGE: ProgrammingLanguage = 'hibrido';
