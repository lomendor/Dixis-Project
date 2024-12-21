import React, { useCallback, forwardRef } from 'react';
import {
  Box,
  Button,
  Text,
  Stack,
  HStack,
  Icon,
  Image,
} from '@chakra-ui/react';
import type {
  StackProps,
  BoxProps,
  ThemeProps,
  SystemStyleObject,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { useStyleConfig } from '@chakra-ui/system';
import { useColorMode } from '@chakra-ui/color-mode';
import { useDropzone, FileRejection, DropzoneProps as ReactDropzoneProps } from 'react-dropzone';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';

export interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedFileTypes?: string[];
  variant?: string;
  size?: string;
}

interface CustomStackProps extends StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  align?: string;
  gap?: number | string;
}

interface CustomDropzoneProps extends BoxProps {
  isDragActive: boolean;
  variant?: string;
  children: React.ReactNode;
}

const DropzoneContainer = forwardRef<HTMLDivElement, CustomDropzoneProps>(
  ({ isDragActive, variant, children, ...props }, ref) => {
    const { colorMode } = useColorMode();
    const bgColor = colorMode === 'light' ? 'gray.50' : 'gray.700';
    const borderColor = colorMode === 'light'
      ? isDragActive ? 'blue.400' : 'gray.200'
      : isDragActive ? 'blue.400' : 'gray.600';
    
    return (
      <Box
        ref={ref}
        bgColor={bgColor}
        borderColor={borderColor}
        transitionProperty="all"
        transitionDuration="0.2s"
        cursor="pointer"
        _hover={{
          borderColor: 'blue.400',
          bgColor: isDragActive ? 'blue.50' : bgColor
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

const CustomStack = forwardRef<HTMLDivElement, CustomStackProps>(
  ({ children, direction = 'column', align, gap, ...props }, ref) => (
    <Stack
      ref={ref}
      direction={direction}
      align={align}
      gap={gap}
      {...props}
    >
      {children}
    </Stack>
  )
);

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onChange,
  maxFiles = 5,
  maxSize = 2 * 1024 * 1024,
  acceptedFileTypes = ['image/*'],
  variant,
  size
}) => {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'gray.50' : 'gray.700';

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (files.length + acceptedFiles.length > maxFiles) {
      toast({
        title: 'Σφάλμα',
        description: `Μπορείτε να ανεβάσετε μέχρι ${maxFiles} αρχεία`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        const errorMessages = errors.map(error => {
          switch (error.code) {
            case 'file-too-large':
              return `Το αρχείο ${file.name} είναι πολύ μεγάλο. Μέγιστο μέγεθος: ${maxSize / 1024 / 1024}MB`;
            case 'file-invalid-type':
              return `Ο τύπος του αρχείου ${file.name} δεν υποστηρίζεται`;
            default:
              return `Σφάλμα στο αρχείο ${file.name}: ${error.message}`;
          }
        });

        toast({
          title: 'Σφάλμα',
          description: errorMessages.join('\n'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
      return;
    }

    onChange([...files, ...acceptedFiles]);
  }, [files, maxFiles, maxSize, onChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce<Record<string, string[]>>((acc: Record<string, string[]>, type: string) => ({
      ...acc,
      [type]: []
    }), {}),
    maxSize,
    multiple: true
  });

  const removeFile = (index: number): void => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  return (
    <Stack direction="column" gap={4} width="100%" align="stretch">
      <DropzoneContainer
        {...getRootProps()}
        isDragActive={isDragActive}
        variant={variant}
        p={6}
        border="2px dashed"
        borderRadius="md"
      >
        <input {...getInputProps()} />
        <Stack direction="column" gap={2} align="center">
          <Icon as={AddIcon} w={6} h={6} color="gray.400" />
          <Text textAlign="center" color="gray.500" fontWeight="medium">
            {isDragActive
              ? 'Αφήστε τα αρχεία εδώ...'
              : 'Σύρετε αρχεία εδώ ή κάντε κλικ για επιλογή'}
          </Text>
          <Text fontSize="sm" color="gray.400">
            Μέγιστο μέγεθος: {maxSize / 1024 / 1024}MB
          </Text>
        </Stack>
      </DropzoneContainer>

      {files.length > 0 && (
        <Stack direction="column" gap={2} align="stretch">
          {files.map((file: File, index: number) => (
            <HStack
              key={index}
              p={2}
              bgColor="white"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              justify="space-between"
              transitionProperty="all"
              transitionDuration="0.2s"
              _hover={{
                borderColor: 'blue.200',
                bgColor: 'blue.50'
              }}
            >
              <HStack gap={3}>
                {file.type.startsWith('image/') && (
                  <Box
                    position="relative"
                    width="40px"
                    height="40px"
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                  </Box>
                )}
                <Box>
                  <Text fontWeight="medium" fontSize="sm">
                    {file.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {(file.size / 1024).toFixed(1)}KB
                  </Text>
                </Box>
              </HStack>
              <Button
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => removeFile(index)}
                _hover={{
                  bgColor: 'red.50'
                }}
              >
                <DeleteIcon />
              </Button>
            </HStack>
          ))}
        </Stack>
      )}
    </Stack>
  );
}; 