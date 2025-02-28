# QEMU and FreeRTOS on NXP S32K3X8EVB

<details closed>
<summary><b>Table of Contents</b></summary>
 
&nbsp;• [Introduction](#introduction) <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• [Requirements](#requirements) <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• [Setting Up the Project Environment](#setting-up-the-project-environment) <br>
&nbsp;• [Part 1 - QEMU Board Emulation](#part-1---qemu-board-emulation) <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• [Setting Up QEMU](#setting-up-qemu) <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• [Creating the Board](#creating-the-board) <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• [Adding the S32K3X8EVB Board](#adding-the-s32k3x8evb-board) <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• [Compiling QEMU](#compiling-qemu) <br>
&nbsp;• [Part 2 - FreeRTOS Porting](#part-2---freertos-porting) <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• [Setting Up FreeRTOS](#setting-up-freertos) <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• [Running FreeRTOS on QEMU](#running-freertos-on-qemu) <br>
&nbsp;• [Part 3 - Simple Application](#part-3---simple-application) <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• [Creating all the files](#creating-all-the-files) <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• [Compiling and Running the Application](#compiling-and-running-the-application) <br>
&nbsp;• [Memory Protection Unit (MPU) Implementation](#memory-protection-unit-mpu-implementation) <br>
&nbsp;• [Conclusion](#conclusion) <br>

</details>

## Introduction

This guide provides a comprehensive walkthrough of our project, which involves:

1. Emulating the **NXP S32K3X8EVB** board using **QEMU**.
2. Porting **FreeRTOS** to run on the emulated board.
3. Creating a simple application to demonstrate the setup.

#### Prerequisites

- The project was developed on **Ubuntu 22.04 LTS** and should work with most **Debian-based distributions**.
- The commands provided in this guide use **`apt`** as the package manager. If you are using a non-Debian distribution, equivalent packages may be required, which might differ depending on the package manager used by your system.

### Requirements

To successfully complete this project, you will need the following:
- A Linux-based operating system (e.g., Ubuntu)
- Git for version control
- QEMU for hardware emulation
- FreeRTOS for the real-time operating system
- ARM GCC toolchain for compiling the code
- Ninja build system for building QEMU

You can verify if you have all the necessary tools installed by running the following commands:

```sh
# Check for Git
git --version

# Check for QEMU
qemu-system-arm --version

# Check for ARM GCC toolchain
gcc-arm-none-eabi --version

# Check for Ninja build system
ninja --version
```

If any of these commands return an error or indicate the tool is not installed, follow the detailed configuration steps below.

<details closed>
<summary><b>Configuration Details</b></summary>

### Strictly Needed Dependencies

The following packages are essential for building and running QEMU, the ARM GCC toolchain, and the rest of the project:
    
- **Core Build Tools**:
  - `build-essential` (includes `gcc`, `g++`, `make`)
  - `python3` (needed for QEMU build scripts)
  - `python3-pip` (for installing Python-related dependencies, if needed)

- **QEMU-Specific Build Dependencies**:
  - `git` (version control to clone repositories)
  - `libglib2.0-dev` (core library for QEMU)
  - `libfdt-dev` (for working with device tree files)
  - `libpixman-1-dev` (required for graphics emulation)
  - `zlib1g-dev` (for compression support)
  - `ninja-build` (for faster builds compared to Makefiles)
  -  `flex` and `bison` (required for QEMU's device emulation parsing logic)

- **ARM Toolchain**:
  - `gcc-arm-none-eabi` (the ARM GCC compiler)
  - `gdb-multiarch`  (a versatile debugger for cross-architecture debugging, including ARM)

### Optional Dependencies

These dependencies provide additional QEMU functionality or extend its features. They are not strictly required but are recommended if you want advanced capabilities:
    
- **Virtualization and I/O Support**:
  - `libaio-dev`, `libcap-ng-dev`, `libudev-dev`

- **Networking and Filesystem Support**:
  - `libslirp-dev`, `libattr1-dev`, `libnfs-dev`

- **Graphical and Display Support**:
  - `libdrm-dev`, `libsdl2-dev`, `libspice-protocol-dev`, `libspice-server-dev`, `libgbm-dev`, `libepoxy-dev`, `libvirglrenderer-dev`, `libgtk-3-dev`

- **Peripheral and USB Support**:
  - `libusb-1.0-0-dev`

- **Sound Support**:
  - `libpulse-dev`

- **Terminal and UI Support**:
  - `libncurses5-dev`, `libncursesw5-dev`, `libvte-2.91-dev`

- **Multimedia and File Format Support**:
  - `libjpeg8-dev`, `libpng-dev`

### Installation Command

To install all necessary dependencies (strictly needed and optional), run the following commands:

```sh
sudo apt update && sudo apt upgrade -y
sudo apt install git bison flex libglib2.0-dev libfdt-dev libpixman-1-dev zlib1g-dev \
ninja-build build-essential python3 python3-pip libaio-dev libcap-ng-dev \
libiscsi-dev libattr1-dev libnfs-dev libudev-dev libxen-dev libepoxy-dev \
libdrm-dev libgbm-dev libvirglrenderer-dev libgtk-3-dev libspice-protocol-dev \
libspice-server-dev libusb-1.0-0-dev libpulse-dev libsdl2-dev libslirp-dev \
libncurses5-dev libncursesw5-dev libx11-dev libxext-dev libxt-dev \
libpng-dev libjpeg8-dev libvte-2.91-dev libfuse-dev gcc-arm-none-eabi gdb-multiarch
```

Once these dependencies are installed, re-run the verification commands listed above to ensure everything is set up correctly.

</details>

### Setting Up the Project Environment

1. Create a directory for the project:
    ```sh
    mkdir project_name
    cd project_name
    ```

2. The final structure will be like this:
    ```
    project_name
    ├── qemu
    ├── FreeRTOS
    └── App
    ```
## Part 1 - QEMU Board Emulation

### Setting Up QEMU

1. Clone the QEMU repository:
    ```sh
    git clone https://github.com/qemu/qemu.git
    cd qemu
    ```

2. Create a new branch for your custom board (optional):
    ```sh
    git checkout -b s32k3x8evb-support
    ```

### Creating the Board

The specific board that we are implementing and should refer to is the **`S32K358EVB`**.

The `s32k3x8evb_board.c` file is the core of the QEMU board emulation. It includes several key sections:

<!-- TODO: check -->

1. **File Header and Includes**:
    - The file starts with a header that includes the authors and a brief description of the functionalities provided.
    - It includes necessary QEMU headers and other system headers required for memory management, hardware components, and system emulation.

2. **Memory Regions**:
    - Defines constants for memory regions such as flash and SRAM.
    - Functions to initialize these memory regions, including `s32k3x8_initialize_memory_regions()`, which sets up the flash and SRAM memory blocks.

3. **LPUART Initialization**:
    - The `initialize_lpuarts()` function sets up the LPUART devices.
    - It configures each LPUART, assigns base addresses, and connects interrupts to the NVIC.

4. **Interrupts and NVIC**:
    - The Nested Vectored Interrupt Controller (NVIC) is initialized in the `s32k3x8_init()` function.
    - Configures the NVIC with the number of IRQs and priority bits, and connects it to the system clock.

5. **Timers**:
    - Initializes PIT timers in the `s32k3x8_init()` function.
    - Each timer is configured with a base address and connected to the NVIC.

6. **Firmware Loading**:
    - The `s32k3x8_load_firmware()` function loads the firmware into the emulated flash memory.
    - Uses the `armv7m_load_kernel()` function to load the kernel into the flash memory.

7. **Machine Initialization**:
    - The `s32k3x8_init()` function is the main initialization function for the board.
    - It sets up the system memory, SoC container, system controller, clocks, NVIC, LPUARTs, and timers.
    - Logs the initialization process if verbose mode is enabled.

8. **Class Initialization**:
    - The `s32k3x8_class_init()` function sets up the machine class, including the default CPU type and number of CPUs.
    - Registers the machine type with QEMU.

For the full content of the `s32k3x8evb_board.c` file, refer to the file located at: [`qemu/hw/arm/s32k3x8evb_board.c`](qemu/hw/arm/s32k3x8evb_board.c).

### Adding the S32K3X8EVB Board

1. Insert the file `s32k3x8evb_board.c` in the appropriate directory:
    ```plaintext
    // filepath: /project_name/qemu/hw/arm/s32k3x8evb_board.c
    // ...existing code...
    ```

2. Update the `meson.build` file to include the new board:
    ```plaintext
    // filepath: /project_name/qemu/hw/arm/meson.build
    arm_ss.add(when: 'CONFIG_S32K3X8EVB', if_true: files('s32k3x8evb_board.c'))
    ```

3. Add the configuration in `Kconfig`:
    ```plaintext
    // filepath: /project_name/qemu/hw/arm/Kconfig
    config S32K3X8EVB
        bool
        default y
        depends on TCG && ARM
        select ARM_V7M
        select ARM_TIMER
    ```

4. Update the `default.mak` file:
    ```plaintext
    // filepath: /project_name/qemu/configs/devices/s32k3x8evb-softmmu/default.mak
    CONFIG_S32K3X8EVB=y
    ```

### Compiling QEMU

1. Configure and compile QEMU:
    ```sh
    cd qemu && ./configure
    cd qemu && ninja -C build qemu-system-arm
    ```

2. Verify the build and display the machine:
    ```sh
    ./build/qemu-system-arm --machine help | grep s32k3x8evb
    ```

    This command should list the `s32k3x8evb` machine if the build was successful.

> This is the output of the **board build logging**.
> It can be seen during the application run.
> 
> <details closed>
> <summary>Output</summary>
> 
> ```plaintext
> ======================== Initializing the System =========================
> 
> ------------------ Initialization of the memory regions ------------------
> 
> Initializing flash memory...
> 
> Initializing SRAM memory...
> 
> Initializing ITCM memory...
> 
> Initializing DTCM memory...
> 
> Memory regions initialized successfully.
> 
> --------------------- Initialization of the Clocks -----------------------
> 
> Clock initialized.
> 
> ------------------- Initialization of the system NVIC --------------------
> 
> NVIC realized.
> 
> ---------------------- Initializing LPUART Devices -----------------------
> 
> Initialized LPUART  0 at base address 0x4006a000
> Initialized LPUART  1 at base address 0x4006b000
> Initialized LPUART  2 at base address 0x4006c000
> Initialized LPUART  3 at base address 0x4006d000
> Initialized LPUART  4 at base address 0x4006e000
> Initialized LPUART  5 at base address 0x4006f000
> Initialized LPUART  6 at base address 0x40070000
> Initialized LPUART  7 at base address 0x40071000
> Initialized LPUART  8 at base address 0x40072000
> Initialized LPUART  9 at base address 0x40073000
> Initialized LPUART 10 at base address 0x40074000
> Initialized LPUART 11 at base address 0x40075000
> Initialized LPUART 12 at base address 0x40076000
> Initialized LPUART 13 at base address 0x40077000
> Initialized LPUART 14 at base address 0x40078000
> Initialized LPUART 15 at base address 0x40079000
> 
> All LPUART devices initialized and connected to NVIC.
> 
> ---------------------- Initialization of the Timers ----------------------
> 
> First Timer Initialized Correctly
> 
> Second Timer Initialized Correctly
> 
> Third Timer Initialized Correctly
> 
> ---------------- Loading the Kernel into the flash memory ----------------
> 
> Kernel loaded into flash memory.
> 
> System initialized.
> 
> Starting to run...
> 
> ==========================================================================
> ```
> 
> </details>


## Part 2 - FreeRTOS Porting

To test the FreeRTOS porting on QEMU, we're going to run FreeRTOS with a very simple task that prints every second.

### Setting Up FreeRTOS

1. Clone the FreeRTOS repository:
    ```sh
    cd project_name
    git clone https://github.com/FreeRTOS/FreeRTOS.git
    ```

2. Create the directory structure:
    ```sh
    mkdir App
    mkdir App/Peripherals
    ```

    For now, the `Peripherals` directory is only for UART/print functionality.

3. Create the following files in the `App` directory:
    - `main.c`
    - `s32_linker.ld`
    - `s32_startup.c`
    - `FreeRTOSConfig.h`
    - `Makefile`
    - `Peripherals/uart.c`
    - `Peripherals/uart.h`
    - `Peripherals/printf-stdarg.c`
    - `Peripherals/printf-stdarg.h`

4. Now the structure should look like this:
    ```
    project_name/
    ├── qemu/
    ├── FreeRTOS/
    └── App/
        ├── main.c
        ├── s32_linker.ld
        ├── s32_startup.c
        ├── FreeRTOSConfig.h
        ├── Makefile
        └── Peripherals/
            ├── uart.c
            ├── uart.h
            ├── printf-stdarg.c
            └── printf-stdarg.h
    ```

### Running FreeRTOS on QEMU

1. The `Peripherals` files (`uart.c/.h` and `printf-stdarg.c/.h`) can be copied from the files in [`App/Peripherals`](App/Peripherals).

2. Implement the following files:

    - `s32_startup.c`: This file contains the startup code for the S32K3X8EVB board.

        <details closed>
        <summary>Code snippet</summary>

        ```c
        /* startup.c */

        /* Peripheral includes */
        #include "uart.h"
        #include <stdio.h>

        /* FreeRTOS interrupt handlers */
        extern void vPortSVCHandler( void );
        extern void xPortPendSVHandler( void );
        extern void xPortSysTickHandler( void );

        /* Memory section markers from linker script */
        extern uint32_t _estack;     /* Stack top          */
        extern uint32_t _sidata;     /* .data LMA (Flash)  */
        extern uint32_t _sdata;      /* .data VMA (RAM)    */
        extern uint32_t _edata;      /* End of .data       */
        extern uint32_t _sbss;       /* Start of .bss      */
        extern uint32_t _ebss;       /* End of .bss        */

        /* Exception handlers */
        void Reset_Handler(void) __attribute__((naked));
        static void HardFault_Handler(void) __attribute__((naked));
        static void MemManage_Handler(void) __attribute__((naked));
        static void Default_Handler(void);

        /* Main application entry */
        extern int main(void);

        /* Fault diagnostic functions */
        void prvGetRegistersFromStack(uint32_t *pulFaultStackAddress) __attribute__((used));
        void print_fault_info(uint32_t cfsr, uint32_t mmfar, uint32_t bfar);

        /*-----------------------------------------------------------------------------------------*/
        /* Reset Handler - Core initialization sequence                                            */
        /*-----------------------------------------------------------------------------------------*/

        void Reset_Handler(void) 
        {
            /* 1. Initialize main stack pointer */
            __asm volatile (
                "ldr r0, =_estack\n\t"
                "msr msp, r0"
            );

            /* 2. Copy data segment from flash to RAM */
            uint32_t *data_load = &_sidata;
            uint32_t *data_vma = &_sdata;
            while(data_vma < &_edata) *data_vma++ = *data_load++;

            /* 3. Zero-initialize BSS segment */
            uint32_t *bss_start = &_sbss;
            uint32_t *bss_end = &_ebss;
            while(bss_start < bss_end) *bss_start++ = 0;

            /* 4. Call platform initialization */
            extern void SystemInit(void);
            SystemInit();

            /* 5. Jump to main application */
            main();

            /* 6. Fallback if main returns */
            while(1);
        }

        /*-----------------------------------------------------------------------------------------*/
        /* Hard Fault Handler - Generic fault catcher                                              */
        /*-----------------------------------------------------------------------------------------*/

        void HardFault_Handler(void)
        {
            __asm volatile (
                " tst lr, #4              \n"
                " ite eq                  \n"
                " mrseq r0, msp           \n"
                " mrsne r0, psp           \n"
                " ldr r1, [r0, #24]       \n"
                " ldr r2, =prvGetRegistersFromStack \n"
                " bx r2                   \n"
                " .ltorg                  \n"
            );
        }

        /*-----------------------------------------------------------------------------------------*/
        /* Fault Register Analysis                                                                 */
        /*-----------------------------------------------------------------------------------------*/

        void print_fault_info(uint32_t cfsr, uint32_t mmfar, uint32_t bfar)
        {
            char buf[64];
            
            /* CFSR Decoding */
            UART_printf("\nConfigurable Fault Status Register:\n");
            snprintf(buf, sizeof(buf), "  CFSR: 0x%08lX\n", cfsr);
            UART_printf(buf);
            
            /* Memory Management Faults */
            if(cfsr & 0xFF) {
                UART_printf("  Memory Management Fault:\n");
                if(cfsr & (1 << 0)) UART_printf("    IACCVIOL: Instruction access violation\n");
                if(cfsr & (1 << 1)) UART_printf("    DACCVIOL: Data access violation\n");
                if(cfsr & (1 << 3)) UART_printf("    MUNSTKERR: MemManage on exception return\n");
                if(cfsr & (1 << 4)) UART_printf("    MSTKERR: MemManage on exception entry\n");
                if(cfsr & (1 << 7)) {
                    snprintf(buf, sizeof(buf), "    MMFAR: 0x%08lX\n", mmfar);
                    UART_printf(buf);
                }
            }
        }

        /*-----------------------------------------------------------------------------------------*/
        /* Register Dump from Fault Context                                                        */
        /*-----------------------------------------------------------------------------------------*/

        void prvGetRegistersFromStack(uint32_t *pulFaultStackAddress)
        {
            volatile uint32_t r0  = pulFaultStackAddress[0];
            volatile uint32_t r1  = pulFaultStackAddress[1];
            volatile uint32_t r2  = pulFaultStackAddress[2];
            volatile uint32_t r3  = pulFaultStackAddress[3];
            volatile uint32_t r12 = pulFaultStackAddress[4];
            volatile uint32_t lr  = pulFaultStackAddress[5];
            volatile uint32_t pc  = pulFaultStackAddress[6];
            volatile uint32_t psr = pulFaultStackAddress[7];

            /* Get fault status registers */
            uint32_t cfsr  = *(volatile uint32_t*)0xE000ED28;
            uint32_t mmfar = *(volatile uint32_t*)0xE000ED34;
            uint32_t bfar  = *(volatile uint32_t*)0xE000ED38;

            char buffer[100];
            UART_printf("\n*** Hardware Fault Detected ***\n");
            
            /* Print general registers */
            snprintf(buffer, sizeof(buffer), "R0   = 0x%08lX\n", r0);  UART_printf(buffer);
            snprintf(buffer, sizeof(buffer), "R1   = 0x%08lX\n", r1);  UART_printf(buffer);
            snprintf(buffer, sizeof(buffer), "R2   = 0x%08lX\n", r2);  UART_printf(buffer);
            snprintf(buffer, sizeof(buffer), "R3   = 0x%08lX\n", r3);  UART_printf(buffer);
            snprintf(buffer, sizeof(buffer), "R12  = 0x%08lX\n", r12); UART_printf(buffer);
            snprintf(buffer, sizeof(buffer), "LR   = 0x%08lX\n", lr);  UART_printf(buffer);
            snprintf(buffer, sizeof(buffer), "PC   = 0x%08lX\n", pc);  UART_printf(buffer);
            snprintf(buffer, sizeof(buffer), "PSR  = 0x%08lX\n", psr); UART_printf(buffer);

            /* Detailed fault analysis */
            print_fault_info(cfsr, mmfar, bfar);
            
            while(1);
        }

        /*-----------------------------------------------------------------------------------------*/
        /* Default Exception Handler                                                               */
        /*-----------------------------------------------------------------------------------------*/

        void Default_Handler(void)
        {
            __asm volatile(
                "Infinite_Loop:\n"
                "    b Infinite_Loop\n"
            );
        }

        /*-----------------------------------------------------------------------------------------*/
        /* Interrupt Vector Table                                                                  */
        /*-----------------------------------------------------------------------------------------*/

        const uint32_t* isr_vector[] __attribute__((section(".isr_vector"))) = {

            /* Core Exceptions */
            (uint32_t*)&_estack,                       /* Initial Stack Pointer */
            (uint32_t*)Reset_Handler,                  /* Reset Handler */
            (uint32_t*)Default_Handler,                /* NMI */
            (uint32_t*)HardFault_Handler,              /* Hard Fault */
            0,                                         /* Reserved */
            (uint32_t*)Default_Handler,                /* Bus Fault */
            (uint32_t*)Default_Handler,                /* Usage Fault */
            0, 0, 0, 0,                                /* Reserved */
            (uint32_t*)vPortSVCHandler,                /* FreeRTOS SVC */
            (uint32_t*)Default_Handler,                /* Debug Monitor */
            0,                                         /* Reserved */
            (uint32_t*)xPortPendSVHandler,             /* FreeRTOS PendSV */
            (uint32_t*)xPortSysTickHandler,            /* FreeRTOS SysTick */
            
            /* Other interrupts not initialized in the Board */
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0
        };

        /*-----------------------------------------------------------------------------------------*/
        ```

        </details>
    
    - `s32_linker.ld`: This file defines the memory layout for the application.

        <details closed>
        <summary>Code snippet</summary>

        ```c
        /*
        * Linker script for S32K358 with FreeRTOS
        * Configured to use ITCM, DTCM, SRAM, and Flash memory regions.
        */

        /* Defining memory regions */
        MEMORY
        {
            /* ITCM: Queues and performance-critical data */
            ITCM0      (RWX) : ORIGIN = 0x00000000, LENGTH = 64K
            ITCM2      (RWX) : ORIGIN = 0x00010000, LENGTH = 64K

            /* PFLASH: Main program */
            PFLASH     (RX)  : ORIGIN = 0x00400000, LENGTH = 8M

            /* DFLASH: Non-volatile data */
            DFLASH     (RW)  : ORIGIN = 0x10000000, LENGTH = 128K

            /* DTCM: Stack, heap, and critical data */
            DTCM0      (RW)  : ORIGIN = 0x20000000, LENGTH = 128K
            DTCM2      (RW)  : ORIGIN = 0x21800000, LENGTH = 128K

            /* SRAM: Generic data */
            SRAM_STDBY (RW)  : ORIGIN = 0x20400000, LENGTH = 64K  /* SRAM Standby */
            SRAM0      (RW)  : ORIGIN = 0x20410000, LENGTH = 192K /* Remaining SRAM0 */
            SRAM1      (RW)  : ORIGIN = 0x20440000, LENGTH = 256K
            SRAM2      (RW)  : ORIGIN = 0x20480000, LENGTH = 256K

            /* Combined SRAM region */
            SRAM       (RW)  : ORIGIN = 0x20400000, LENGTH = 704K /* Total SRAM */

            /* Flash UTEST */
            UTEST      (RX)  : ORIGIN = 0x1B000000, LENGTH = 8K
        }

        /* Minimum size for heap and stack */
        _Min_Heap_Size = 0x2000;   /* Increased to 8 KB for more dynamic memory */
        _Min_Stack_Size = 0x800;   /* Increased to 2 KB for better task handling */

        /* Initial stack pointer */
        _estack = ORIGIN(DTCM2) + LENGTH(DTCM2);

        /* Linker Sections */
        SECTIONS
        {
            /* ISR Vector Table */
            .isr_vector :
            {
                __vector_table = .;
                KEEP(*(.isr_vector))
                . = ALIGN(4);
            } > ITCM0

            /* Readonly code and data section */
            .text :
            {
                __coderom_start__ = .;
                *(.text*)         /* Code */
                *(.rodata*)       /* Read-only data */
                *(.constdata*)    /* Constant data */
                _etext = .;       /* End of text section */
                KEEP(*(.init))    /* Initialization code */
            } > PFLASH

            /* Initialized data (RAM) */
            .data :
            {
                . = ALIGN(8);
                _sdata = .;       /* Start of initialized data in RAM */
                *(.data)          /* Initialized global/static variables */
                *(.data.*)        /* Section-specific initialized data */
                *(vtable)         /* Vector table */
                _edata = .;       /* End of initialized data in RAM */
            } > DTCM0 AT > PFLASH

            /* Symbols for copying from FLASH to RAM */
            _sidata = LOADADDR(.data); /* Load address (FLASH) of .data */

            /* Uninitialized data (RAM) */
            .bss :
            {
                . = ALIGN(8);
                _sbss = .;        /* Start of uninitialized data */
                *(.bss)           /* Uninitialized global/static variables */
                *(.bss.*)         /* Section-specific uninitialized data */
                _ebss = .;        /* End of uninitialized data */
            } > DTCM0

            /* Standby RAM */
            .standby_ram :
            {
                . = ALIGN(8);
                *(.standby_ram)   /* Data specific to standby mode */
            } > SRAM_STDBY

            /* Test data */
            .utest :
            {
                KEEP(*(.utest))   /* Test-related data */
            } > UTEST

            /* Heap */
            .heap :
            {
                . = ALIGN(8);
                PROVIDE(end = .); /* End of all sections */
                PROVIDE(_end = .);
                _heap_bottom = .; /* Start of heap */
                . = . + _Min_Heap_Size; /* Allocate minimum heap size */
                _heap_top = .;    /* End of heap */
            } > DTCM0

            /* Stack */
            .stack :
            {
                . = ALIGN(8);
                __stack_start__ = .; /* Start of stack */
                . = . + _Min_Stack_Size; /* Allocate minimum stack size */
                __stack_end__ = .;   /* End of stack */
            } > DTCM2

            /* System call handlers */
            .syscalls :
            {
                __syscalls_flash_start__ = .;
                *(.syscalls) /* System call handlers */
                __syscalls_flash_end__ = .;
            } > PFLASH

            /* Assertions for safety */
            ASSERT(__stack_end__ <= ORIGIN(DTCM2) + LENGTH(DTCM2), "Stack overflow in DTCM2!")
            ASSERT(_heap_top <= ORIGIN(DTCM0) + LENGTH(DTCM0), "Heap overflow in DTCM0!")
        }

        /* Entry point */
        ENTRY(Reset_Handler)

        /* Initial stack pointer */
        PROVIDE(_stack = _estack);
        ```

        </details>

    - `FreeRTOSConfig.h`: This file contains the FreeRTOS configuration settings.

        <details closed>
        <summary>Code snippet</summary>

        ```c
        /*
        * FreeRTOS V202212.00
        * Copyright (C) 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
        *
        * Permission is hereby granted, free of charge, to any person obtaining a copy of
        * this software and associated documentation files (the "Software"), to deal in
        * the Software without restriction, including without limitation the rights to
        * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
        * the Software, and to permit persons to whom the Software is furnished to do so,
        * subject to the following conditions:
        *
        * The above copyright notice and this permission notice shall be included in all
        * copies or substantial portions of the Software.
        *
        * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
        * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
        * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
        * IN AN ACTION OF CONTRACT, TORT or OTHERWISE, ARISING FROM, OUT OF OR IN
        * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        *
        * https://www.FreeRTOS.org
        * https://github.com/FreeRTOS
        *
        */

        #ifndef FREERTOS_CONFIG_H
        #define FREERTOS_CONFIG_H

        /*-----------------------------------------------------------
        * Application specific definitions.
        * Adjusted for balanced priorities and stable timer operation.
        *----------------------------------------------------------*/

        #ifndef __NVIC_PRIO_BITS
        #define __NVIC_PRIO_BITS 4  /* Cortex-M7 uses 4 priority bits */
        #endif

        #define configUSE_TRACE_FACILITY                 0
        #define configGENERATE_RUN_TIME_STATS            0

        #define configUSE_PREEMPTION                     1
        #define configUSE_IDLE_HOOK                      0
        #define configUSE_TICK_HOOK                      0
        #define configCPU_CLOCK_HZ                       ( ( unsigned long ) 143000000 )
        #define configTICK_RATE_HZ                       ( ( TickType_t ) 1000 )
        #define configMINIMAL_STACK_SIZE                 ( ( unsigned short ) 160 )
        #define configTOTAL_HEAP_SIZE                    ( ( size_t ) ( 100 * 1024 ) )
        #define configMAX_TASK_NAME_LEN                  ( 12 )
        #define configUSE_16_BIT_TICKS                   0
        #define configIDLE_SHOULD_YIELD                  0
        #define configUSE_CO_ROUTINES                    0
        #define configUSE_MUTEXES                        1
        #define configUSE_RECURSIVE_MUTEXES              1
        #define configCHECK_FOR_STACK_OVERFLOW           0
        #define configUSE_MALLOC_FAILED_HOOK             0
        #define configUSE_QUEUE_SETS                     1
        #define configUSE_COUNTING_SEMAPHORES            1

        #define configMAX_PRIORITIES                     ( 9UL )
        #define configMAX_CO_ROUTINE_PRIORITIES          ( 2 )
        #define configQUEUE_REGISTRY_SIZE                10
        #define configSUPPORT_STATIC_ALLOCATION          0

        /* Timer-related defines: Balanced priorities for stable operation. */
        #define configUSE_TIMERS                         0
        #define configTIMER_TASK_PRIORITY                (configMAX_PRIORITIES - 4 )
        #define configTIMER_QUEUE_LENGTH                 20
        #define configTIMER_TASK_STACK_DEPTH             (configMINIMAL_STACK_SIZE * 2)

        #define configUSE_TASK_NOTIFICATIONS             1
        #define configTASK_NOTIFICATION_ARRAY_ENTRIES    3

        /* Include API functions for required functionality. */
        #define INCLUDE_vTaskPrioritySet                  1
        #define INCLUDE_uxTaskPriorityGet                 1
        #define INCLUDE_vTaskDelete                       1
        #define INCLUDE_vTaskCleanUpResources             0
        #define INCLUDE_vTaskSuspend                      1
        #define INCLUDE_vTaskDelayUntil                   1
        #define INCLUDE_vTaskDelay                        1
        #define INCLUDE_uxTaskGetStackHighWaterMark       1
        #define INCLUDE_xTaskGetSchedulerState            1
        #define INCLUDE_xTimerGetTimerDaemonTaskHandle    1
        #define INCLUDE_xTaskGetIdleTaskHandle            1
        #define INCLUDE_xSemaphoreGetMutexHolder          1
        #define INCLUDE_eTaskGetState                     1
        #define INCLUDE_xTimerPendFunctionCall            1
        #define INCLUDE_xTaskAbortDelay                   1
        #define INCLUDE_xTaskGetHandle                    1

        #define configUSE_STATS_FORMATTING_FUNCTIONS      0

        #define configKERNEL_INTERRUPT_PRIORITY           ( 255 )  /* Lowest priority for kernel interrupt */
        #define configMAX_SYSCALL_INTERRUPT_PRIORITY      ( 5 << (8 - __NVIC_PRIO_BITS) )  /* NVIC priority level */

        #ifndef __IASMARM__
            #define configASSERT( x ) if( ( x ) == 0 ) while(1);
        #endif

        #define configUSE_PORT_OPTIMISED_TASK_SELECTION   1
        #define configRUN_ADDITIONAL_TESTS                1
        #define configSTREAM_BUFFER_TRIGGER_LEVEL_TEST_MARGIN    4

        #define configENABLE_BACKWARD_COMPATIBILITY 0

        #endif /* FREERTOS_CONFIG_H */
        ```

        </details>

    - `Makefile`: This file contains the build configuration and rules.

        <details closed>
        <summary>Code snippet</summary>

        ```Makefile
        # The directory that contains FreeRTOS source code
        FREERTOS_ROOT := ../../group2/FreeRTOS/FreeRTOS/

        # Demo code
        DEMO_PROJECT := .

        # FreeRTOS kernel
        KERNEL_DIR := $(FREERTOS_ROOT)Source
        KERNEL_PORT_DIR := $(KERNEL_DIR)/portable/GCC/ARM_CM7/r0p1

        # Where to store all the generated files (objects, elf and map)
        OUTPUT_DIR := ./Output

        # Demo project name and output files
        DEMO_NAME := Test
        ELF := $(OUTPUT_DIR)/$(DEMO_NAME).elf
        MAP := $(OUTPUT_DIR)/$(DEMO_NAME).map

        # Compiler toolchain
        CC := arm-none-eabi-gcc
        LD := arm-none-eabi-gcc
        SIZE := arm-none-eabi-size

        # Emulator used for ARM systems
        QEMU := ../qemu/build/qemu-system-arm

        # Target embedded board and CPU
        MACHINE := s32k3x8evb 
        CPU := cortex-m7

        # QEMU flags for debugging
        QEMU_FLAGS_DBG = -s -S 

        # Include directories
        INCLUDE_DIRS = -I$(KERNEL_DIR)/include -I$(KERNEL_PORT_DIR)
        INCLUDE_DIRS += -I$(DEMO_PROJECT)
        INCLUDE_DIRS += -I$(DEMO_PROJECT)/Peripherals 

        # Source file search paths
        VPATH += $(KERNEL_DIR)
        VPATH += $(KERNEL_PORT_DIR)
        VPATH += $(KERNEL_DIR)/portable/MemMang
        VPATH += $(DEMO_PROJECT)
        VPATH += $(DEMO_PROJECT)/Peripherals

        # Compiler flags
        CFLAGS = $(INCLUDE_DIRS)
        CFLAGS += -ffreestanding
        CFLAGS += -mcpu=$(CPU)
        CFLAGS += -mthumb
        CFLAGS += -mfpu=fpv5-d16 -mfloat-abi=hard
        CFLAGS += -Wall
        CFLAGS += -Wextra
        CFLAGS += -Wshadow
        CFLAGS += -g3
        CFLAGS += -Os
        CFLAGS += -ffunction-sections
        CFLAGS += -fdata-sections
        CFLAGS += -DCMSDK_CM7

        # Linker flags
        LDFLAGS = -T ./s32_linker.ld
        LDFLAGS += -nostartfiles
        LDFLAGS += -specs=nano.specs
        LDFLAGS += -specs=nosys.specs
        LDFLAGS += -Xlinker -Map=$(MAP)
        LDFLAGS += -Xlinker --gc-sections
        LDFLAGS += -mcpu=$(CPU)
        LDFLAGS += -mthumb
        LDFLAGS += -mfpu=fpv5-d16 -mfloat-abi=hard

        # Kernel source files
        SOURCE_FILES += $(KERNEL_DIR)/list.c
        SOURCE_FILES += $(KERNEL_DIR)/tasks.c
        SOURCE_FILES += $(KERNEL_DIR)/queue.c
        SOURCE_FILES += $(KERNEL_DIR)/event_groups.c
        SOURCE_FILES += $(KERNEL_DIR)/stream_buffer.c
        SOURCE_FILES += $(KERNEL_DIR)/portable/MemMang/heap_4.c
        SOURCE_FILES += $(KERNEL_PORT_DIR)/port.c

        # Demo source files
        SOURCE_FILES += $(DEMO_PROJECT)/main.c
        SOURCE_FILES += $(DEMO_PROJECT)/Peripherals/uart.c
        SOURCE_FILES += $(DEMO_PROJECT)/Peripherals/printf-stdarg.c

        # Start-up code
        SOURCE_FILES += ./s32_startup.c

        # Create list of object files with the same names of the sources
        OBJS = $(SOURCE_FILES:%.c=%.o)

        # Remove path from object filename
        OBJS_NOPATH = $(notdir $(OBJS))

        # Prepend output dir to object filenames
        OBJS_OUTPUT = $(patsubst %.o, $(OUTPUT_DIR)/%.o, $(OBJS_NOPATH))

        #----------------------------------------------------------------------#
        #-------------- Section Dedicated to Application ----------------------#

        # Link the final executable
        $(ELF): $(OBJS_OUTPUT) ./s32_linker.ld Makefile
            echo "\n\n--- Final linking ---\n"
            $(LD) $(LDFLAGS) $(OBJS_OUTPUT) -o $(ELF)
            $(SIZE) $(ELF)

        # Compile source files to object files
        $(OUTPUT_DIR)/%.o : %.c Makefile $(OUTPUT_DIR)
            $(CC) $(CFLAGS) -c $< -o $@

        # Create output directory if it doesn't exist
        $(OUTPUT_DIR):
            mkdir -p $(OUTPUT_DIR)

        # Clean all generated files
        clean:
            rm -rf $(ELF) $(MAP) $(OUTPUT_DIR)/*.o $(OUTPUT_DIR)

        # Default target
        all: $(ELF)

        # Run QEMU emulator
        qemu_start:
            $(QEMU) -machine $(MACHINE) -cpu $(CPU) -kernel $(ELF) -monitor none -nographic -serial stdio

        # New run command: clean, build, and start QEMU
        run: clean all qemu_start
        ```

        </details>

3. Implement the `main.c` file:

    <details closed>
    <summary>Code snippet</summary>

    ```c
    /* FreeRTOS includes */
    #include "FreeRTOS.h"
    #include "task.h"

    /* Peripheral includes */
    #include "uart.h"
    #include "IntTimer.h"
    #include "printf-stdarg.h"

    /* Task priorities */
    #define mainTASK_PRIORITY (tskIDLE_PRIORITY + 2)

    /* Task prototypes */
    void vTask1(void *pvParameters);

    int main(int argc, char **argv) 
    {
        (void) argc;
        (void) argv;

        /* Hardware initialisation. */
        UART_init();

        /* Create the tasks. */
        xTaskCreate(vTask1, "Task1", configMINIMAL_STACK_SIZE, NULL, mainTASK_PRIORITY, NULL);

        printf("Ready to run the scheduler...\n");
        vTaskStartScheduler();

        for (;;);
    }

    void vTask1(void *pvParameters) 
    {
        (void) pvParameters;

        for (;;) 
        {
            printf("Task1 is running...\n");
            vTaskDelay(1000);
        }
    }
    ```

    </details>

4. Test everything:
    ```sh
    cd App
    make run
    ```

    If everything works correctly, it means that the **FreeRTOS porting** has been successfully implemented.

## Part 3 - Simple Application

### Implement all the files

To create a simple application, you need to set up several files, including the Makefile, startup code, linker script, FreeRTOS configuration, and the main application code.

Most of the files have already been implemented to test the FreeRTOS porting. Now, we need to create and implement all the other files needed and update the existing files.

1. **Startup Code (`s32_startup.c`)**: This file contains the startup code for the S32K3X8EVB board.

    ```c
    // filepath: /project_name/App/s32_startup.c
    // ...existing code...

    /* Peripheral includes */
    #include "IntTimer.h"

    // ...existing code...

    const uint32_t* isr_vector[] __attribute__((section(".isr_vector"), used)) = {
        // ...existing code...
        0, /* 7 */
        ( uint32_t * ) TIMER0_IRQHandler,  // Timer 0
        ( uint32_t * ) TIMER1_IRQHandler,  // Timer 1
        0, /* 10 */
        // ...existing code...
    };

    // ...existing code...
    ```

2. **Linker Script (`s32_linker.ld`)**: This file defines the memory layout for the application.

    The linker file doesn't need to be updated. The one used for the FreeRTOS porting phase is correct. However, it is possible to check the [`App/s32_linker.ld`](App/s32_linker.ld) file.

3. **FreeRTOS Configuration (`FreeRTOSConfig.h`)**: This file contains the FreeRTOS configuration settings.

    Even the FreeRTOS config is already well-implemented. However, it's possible to define some task priorities that can be useful in the app. You can still check the [`App/FreeRTOSConfig.h`](App/FreeRTOSConfig.h) file.

    ```c
    // filepath: /project_name/App/FreeRTOSConfig.h
    // ...existing code...

    /* Define task priorities */
    #define mainTASK_PRIORITY         ( tskIDLE_PRIORITY + 1 ) /* Main task priority */
    #define highTASK_PRIORITY         ( tskIDLE_PRIORITY + 2 ) /* High priority task */
    #define lowTASK_PRIORITY          ( tskIDLE_PRIORITY + 3 ) /* Low priority task  */
    ```

4. **Makefile**: This file contains the build configuration and rules.

    Now it's possible to refer to the [`App/Makefile`](App/Makefile) file in order to have the full list of commands to build, compile, make, and run.

5. **Timer Interrupt Handlers (`IntTimer.c` and `IntTimer.h`)**: These files contain the implementation and declarations for the timer interrupt handlers.

    The `IntTimer.c` and `IntTimer.h` files can be copied from [`App/Peripherals/IntTimer.c`](App/Peripherals/IntTimer.c) and [`App/Peripherals/IntTimer.h`](App/Peripherals/IntTimer.h).

    These files represent the initialization and handling of hardware timers. The timers are used to generate periodic interrupts, which can be used to perform regular tasks such as checking for user activities or suspicious activities.

6. **Main Application Code**: These files contain the main application code.

    The app we've implemented includes these files. They can all be copied and checked from the existing files in the [`App/`](App) directory. Here is a very short description of what they do:

    - `main.c`: Contains the main application entry point and initializes the secure timeout system.
    - `secure_timeout_system.c/.h`: Implements the secure timeout system with tasks for monitoring user activity, handling alerts, and simulating events.
    - `globals.h`: Declares global variables used across the application.

### Compiling and Running the Application

1. Compile the application using the FreeRTOS build system:
    ```sh
    make clean all
    ```

2. Run the compiled application on QEMU:
    ```sh
    make qemu_start
    ```

    It is equivalent to:
    ```sh
    ../qemu/build/qemu-system-arm -machine s32k3x8evb -cpu cortex-m7 -kernel ./Output/app_name.elf -monitor none -nographic -serial stdio
    ```

> It is possible to use a single command:
>   ```sh
>   make run
>   ```

## Memory Protection Unit (MPU) Implementation

In this section, we detail the process of enabling and configuring the **Memory Protection Unit (MPU)** for the **ARM Cortex-M7 core** in our project. This encompasses our research findings, necessary file modifications, and the steps taken to integrate MPU support within FreeRTOS.

### 1. Research and Information Gathering

Our initial research revealed that while FreeRTOS provides MPU support for **ARM Cortex-M4 cores**, direct support for Cortex-M7 was not explicitly documented. Key insights from our investigation include:

- **MPU Region Support**: The Cortex-M7 processor supports up to 16 MPU regions.

- **FreeRTOS MPU Port**: The existing FreeRTOS port for `ARM_CM4_MPU` can be adapted for Cortex-M7, as the scheduler operations remain consistent between these cores.

- **Errata `837070`**: For Cortex-M7 revisions `r0p0` and `r0p1`, Errata `837070` necessitates specific workarounds to ensure correct MPU functionality. 

### 2. Identifying Relevant Files

To implement MPU support, we focused on the following files within the FreeRTOS source code:

- **`FreeRTOSConfig.h`**: Configuration file for FreeRTOS settings.

- **`port.c`**: Located in `FreeRTOS/Source/portable/GCC/ARM_CM4_MPU/`, this file contains MPU setup and context switch handling code.

### 3. Required Modifications

Based on our research, the following modifications were identified:

- **Define MPU Region Count**: Set `configTOTAL_MPU_REGIONS` to 16 in `FreeRTOSConfig.h` to match the Cortex-M7's capabilities.

- **Errata Workaround**: Implement the Errata `837070` workaround in `port.c` for applicable Cortex-M7 revisions.

### 4. Implementation Steps

The implementation involved the following steps:

#### 4.1. Updating `FreeRTOSConfig.h`

- **Define MPU Regions**: Add the following line to specify the number of MPU regions:

  ```c
  #define configTOTAL_MPU_REGIONS 16
  ```

- **Enable Errata Workaround**: For Cortex-M7 `r0p0` or `r0p1` revisions, define the target to apply the necessary workaround:

  ```c
  #define configENABLE_ERRATA_837070_WORKAROUD 1
  ```

> Note: Adjust the definition based on your specific Cortex-M7 revision.

#### 4.2. Modifying `port.c`

- **Errata Workaround Implementation**: Integrate the workaround as outlined in the FreeRTOS pull request [#513](https://github.com/FreeRTOS/FreeRTOS-Kernel/pull/513). This involves adding specific instructions to handle the errata during context switches.

### 5. Testing and Validation

We plan to conduct thorough testing to ensure:

- **MPU Configuration**: Verify that all 16 MPU regions are configurable and behave as expected.
- **Context Switching**: Ensure that context switches occur seamlessly without MPU-related faults.
- **Errata Mitigation**: Confirm that the workaround effectively addresses the issues associated with Errata 837070.

However, we have not completed this testing yet, as the implementation is not working yet.

### 6. Summary

By adapting the existing FreeRTOS `ARM_CM4_MPU/port.c` and applying necessary modifications, we aim to enable **MPU** support for the **ARM Cortex-M7 core** in our project. However, these are things that we hope might work. At the moment, we're still trying to make them work.

> For detailed code implementations and specific changes, please refer to the respective sections in this documentation and the following resources:
> - [FreeRTOS forum discussion on MPU support in Cortex-M7](https://forums.freertos.org/t/freertos-mpu-support-in-arm-cortex-m7/15306)
> - [FreeRTOS Kernel pull request #513](https://github.com/FreeRTOS/FreeRTOS-Kernel/pull/513)
 
## Conclusion

This guide provides a detailed walkthrough of our project, from setting up QEMU to running a FreeRTOS application on the emulated NXP S32K3X8EVB board. By following these steps, you should be able to recreate our project and understand the process of emulating hardware and running an RTOS on it.

If you encounter any errors or bugs, please refer to or contact the [authors](README.md#authors).
