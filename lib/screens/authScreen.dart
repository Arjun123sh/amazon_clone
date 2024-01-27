import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});
  @override
  State<AuthScreen> createState() {
    return _AuthScreenState();
  }
}

class _AuthScreenState extends State<AuthScreen> {
  String? _enteredEmail;
  String? _enteredPassword;
  final _formKey = GlobalKey<FormState>();
  bool _islogin = true;
  void _submit() {
    if (!_formKey.currentState!.validate()) {
      return;
    }
    _formKey.currentState!.save();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Center(
              child: Text(
                'Welcome',
                style: Theme.of(context).textTheme.displayMedium,
              ),
            ),
            Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(
                    height: 18,
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: TextFormField(
                      textCapitalization: TextCapitalization.none,
                      autocorrect: false,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        labelText: 'E-mail',
                        hintText: 'test@gmail.com',
                        isDense: true,
                        contentPadding: const EdgeInsets.fromLTRB(15, 15, 15, 0),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(50),
                        ),
                      ),
                      validator: (value) {
                        if (value == null ||
                            value.trim().isEmpty ||
                            value.contains('@')) {
                          return 'Please Enter a valid email Address';
                        }
                        return null;
                      },
                      onSaved: (value) => _enteredEmail = value!,
                    ),
                  ),
                  const SizedBox(
                    height: 13,
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: TextFormField(
                      autocorrect: false,
                      keyboardType: TextInputType.visiblePassword,
                      decoration: InputDecoration(
                        isDense: true,
                        contentPadding: const EdgeInsets.fromLTRB(15, 15, 15, 0),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(50),
                        ),
                        labelText: 'Password',
                      ),
                      obscureText: true,
                      validator: (value) {
                        if (value == null ||
                            value.trim().isEmpty ||
                            value.length < 6) {
                          return 'Please Enter a valid Password  with more than six characters';
                        }
                        return null;
                      },
                      onSaved: (value) => _enteredPassword = value!,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            ElevatedButton(
              onPressed: _submit,
              child: Text(_islogin ? 'Login' : 'SignIn'),
            ),
            if (!_islogin)
              ElevatedButton(
                onPressed: () {},
                child: const Text('Go To Login'),
              ),
            if (_islogin)
              Padding(
                padding: const EdgeInsets.symmetric(
                  vertical: 3,
                ),
                child: ElevatedButton(
                  onPressed: () {
                    setState(() {
                      _islogin = false;
                    });
                  },
                  child: const Text('Create An Account'),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
